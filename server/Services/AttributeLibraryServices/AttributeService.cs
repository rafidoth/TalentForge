using Microsoft.EntityFrameworkCore;
using server.Dto;
using server.Entities;
using server.ServiceResults;

namespace server.Services.AttributeLibraryServices;

public class AttributeService(ApplicationDbContext db) : IAttributeService
{
    private readonly AttributeLibraryService atLib = new AttributeLibraryService(db);
    public async Task<ServiceResult<AttributeDto>> CreateAsync(
        string name, int typeId, int categoryId,
        string? description, List<string>? dropdownOptions = null
    )
    {
        AppAttribute? newAttribute;
        try
        {
            newAttribute = await atLib.CreateAsync(typeId, name, categoryId, description, dropdownOptions);
            if (newAttribute is null)
                return ServiceResult<AttributeDto>.Failure("Failed to create attribute.", "CREATION_FAILED");
            return ServiceResult<AttributeDto>.Success(MapToDto(newAttribute), "Attribute created successfully.");
        }
        catch (DbUpdateException)
        {
            return ServiceResult<AttributeDto>.Failure(
                $"An attribute with the name '{name}' already exists.", "DUPLICATE_NAME");
        }
    }

    public async Task<ServiceResult<List<AppAttribute>>> GetBuiltInAttributesAsync()
    {
        var result = await atLib.GetBuiltInAttributesAsync();
        return result != null && result.Count > 0
            ? ServiceResult<List<AppAttribute>>.Success(result, "Built-in attributes retrieved successfully.")
            : ServiceResult<List<AppAttribute>>.Failure("No built-in attributes found.", "NOT_FOUND");

    }

    public async Task<ServiceResult<AppAttribute>> GetAttributeByNameAsync(string name)
    {
        var result = await atLib.GetAttributeByNameAsync(name);
        return result != null
            ? ServiceResult<AppAttribute>.Success(result, "Attribute retrieved successfully.")
            : ServiceResult<AppAttribute>.Failure("Attribute not found.", "NOT_FOUND");
    }

    public async Task<ServiceResult<AttributeDto>> UpdateAsync(Guid id, UpdateAttributeDto dto)
    {
        try
        {
            AppAttribute? updatedAttr = await atLib.UpdateAttributeAsync(id, dto.Name, dto.Version, dto.DropdownOptions);
            return updatedAttr != null
                ? ServiceResult<AttributeDto>.Success(MapToDto(updatedAttr), "Attribute updated successfully.")
                : ServiceResult<AttributeDto>.Failure("Failed to update attribute.", "UPDATE_FAILED");
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
        bool result = await atLib.DeleteAttributeAsync(id);
        return result
            ? ServiceResult<bool>.Success(true, "Attribute deleted successfully.")
            : ServiceResult<bool>.Failure("Failed to delete attribute.", "DELETE_FAILED");
    }

    public async Task<ServiceResult<AttributeDto>> GetByIdAsync(Guid id)
    {
        var attrbute = await atLib.FindAttributeByIdAsync(id);
        return attrbute != null
            ? ServiceResult<AttributeDto>.Success(MapToDto(attrbute), null)
            : ServiceResult<AttributeDto>.Failure("Attribute not found.", "NOT_FOUND");
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

    public async Task<ServiceResult<List<AttributeType>>> GetAttributeTypesAsync()
    {
        var types = await atLib.GetAllAttributeTypesAsync();
        if (types == null || types.Count == 0)
        {
            return ServiceResult<List<AttributeType>>.Failure("No attribute types found.", "NOT_FOUND");
        }
        return ServiceResult<List<AttributeType>>.Success(types, null);
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