using Microsoft.EntityFrameworkCore;
using server.Dto;
using server.Entities;
using server.ServiceResults;

namespace server.Services.AttributeLibraryServices;

public class AttributeService(
    ApplicationDbContext db,
    AttributeLibraryService atLib
    ) : IAttributeService
{
    public async Task<ServiceResult<AttributeDto>> CreateAsync(CreateAttributeDto dto)
    {
        ServiceResult<AppAttribute> serviceResult;
        try
        {
            serviceResult = await atLib.CreateAsync(dto.TypeId, dto.Name, dto.CategoryId);
        }
        catch (DbUpdateException)
        {
            return ServiceResult<AttributeDto>.Failure(
                $"An attribute with the name '{dto.Name}' already exists.", "DUPLICATE_NAME");
        }
        return ServiceResult<AttributeDto>.Success(MapToDto(serviceResult.Data!), "Attribute created successfully.");
    }

    public async Task<ServiceResult<AttributeDto>> UpdateAsync(Guid id, UpdateAttributeDto dto)
    {
        try
        {
            var result = await atLib.UpdateAttributeAsync(id, dto.Name, dto.TypeId, dto.CategoryId, dto.Version, dto.DropdownOptions);
            return result.IsSuccess
                ? ServiceResult<AttributeDto>.Success(MapToDto(result.Data!), result.Message)
                : ServiceResult<AttributeDto>.Failure(result.Message, result.ErrorCode);
        }
        catch (DbUpdateConcurrencyException)
        {
            return ServiceResult<AttributeDto>.Failure(
                "The attribute was modified by another user. Please refresh and try again.", "CONFLICT");
        }
        catch (DbUpdateException)
        {
            return ServiceResult<AttributeDto>.Failure(
                $"An attribute with the name '{dto.Name}' already exists.", "DUPLICATE_NAME");
        }
    }

    public async Task<ServiceResult<bool>> DeleteAsync(Guid id)
    {
        return await atLib.DeleteAttributeAsync(id);
    }

    public async Task<ServiceResult<AttributeDto>> GetByIdAsync(Guid id)
    {
        var result = await atLib.GetByIdWithNavigationsAsync(id);
        return result.IsSuccess
            ? ServiceResult<AttributeDto>.Success(MapToDto(result.Data!), null)
            : ServiceResult<AttributeDto>.Failure(result.Message, result.ErrorCode);
    }

    public async Task<ServiceResult<List<AttributeDto>>> SearchAsync(AttributeSearchQuery query)
    {
        var result = await atLib.SearchAttributesAsync(query.Prefix, query.CategoryId, query.UserId, query.Page, query.PageSize);
        var dtos = result.Data!.Select(MapToDto).ToList();
        return ServiceResult<List<AttributeDto>>.Success(dtos, null);
    }

    public async Task<ServiceResult<List<AttributeCategoryDto>>> GetCategoriesAsync()
    {
        var result = await atLib.GetAllCategoriesAsync();
        var dtos = result.Data!.Select(c => new AttributeCategoryDto(c.Id, c.Name)).ToList();
        return ServiceResult<List<AttributeCategoryDto>>.Success(dtos, null);
    }

    public async Task<ServiceResult<AttributeType>> GetAttributeTypeAsync(string name)
    {
        return await atLib.GetAttributeTypeByNameAsync(name);
    }

    public async Task<ServiceResult<AttributeCategory>> GetCategoryAsync(string name)
    {
        return await atLib.GetCategoryByNameAsync(name);
    }

    private AttributeDto MapToDto(AppAttribute attr)
    {
        var version = db.Entry(attr).Property<uint>("Version").CurrentValue;

        return new AttributeDto(
            Id: attr.Id,
            Name: attr.Name,
            TypeId: attr.TypeId ?? 0,
            TypeName: attr.Type?.Name ?? string.Empty,
            CategoryId: attr.CategoryId ?? 0,
            CategoryName: attr.Category?.Name ?? string.Empty,
            IsBuiltin: attr.IsBuiltin,
            DropdownOptions: attr.DropdownOptions
                .Select(o => new DropdownOptionDto(o.Id, o.Label))
                .ToList(),
            Version: version
        );
    }
}