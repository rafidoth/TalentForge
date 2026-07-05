using server.Dto;
using server.Entities;
using server.ServiceResults;

namespace server.Services.AttributeLibraryServices;

public interface IAttributeService
{
    Task<ServiceResult<AttributeDto>> CreateAsync(CreateAttributeDto dto);
    Task<ServiceResult<AttributeDto>> UpdateAsync(Guid id, UpdateAttributeDto dto);
    Task<ServiceResult<bool>> DeleteAsync(Guid id);
    Task<ServiceResult<AttributeDto>> GetByIdAsync(Guid id);
    Task<ServiceResult<List<AttributeDto>>> SearchAsync(AttributeSearchQuery query);
    Task<ServiceResult<List<AttributeCategoryDto>>> GetCategoriesAsync();
    Task<ServiceResult<AttributeType>> GetAttributeTypeAsync(string name);
    Task<ServiceResult<AttributeCategory>> GetCategoryAsync(string name);
    Task<ServiceResult<List<AppAttribute>>> GetBuiltInAttributesAsync();
    Task<ServiceResult<AppAttribute>> GetAttributeByNameAsync(string name);
}