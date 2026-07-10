using server.Dto;
using server.Entities;
using server.Utils;

namespace server.Services.AttributeLibraryServices;

public interface IAttributeService
{
    Task<AttributeDto> CreateAsync(CreateAttributeDto dto);
    Task<AttributeDto> UpdateAsync(Guid id, UpdateAttributeDto dto);
    Task<bool> DeleteAsync(Guid id);
    Task<AttributeDto> GetByIdAsync(Guid id);
    Task<PagedResponse<AttributeDto>> SearchAsync(AttributeSearchQueryDto dto);
    Task<List<AttributeCategoryDto>> GetCategoriesAsync();
    Task<List<AttributeType>> GetAttributeTypesAsync();
    Task<AttributeType> GetAttributeTypeAsync(string name);
    Task<AttributeCategory> GetCategoryAsync(string name);
    Task<List<AppAttribute>> GetBuiltInAttributesAsync();
    Task<AppAttribute> GetAttributeByNameAsync(string name);
    Task AttributExists(Guid attributeId);
}