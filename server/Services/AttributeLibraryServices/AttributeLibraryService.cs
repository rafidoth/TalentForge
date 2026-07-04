
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using server.ServiceResults;

namespace server.Services.AttributeLibraryServices
{
    public class AttributeLibraryService(ApplicationDbContext db)
    {
        public async Task<ServiceResult<AppAttribute?>> CreateAsync(string attributeType)
        {
            var typeResult = await GetAttributeTypeByNameAsync(attributeType);
            return typeResult.IsSuccess && typeResult.Data != null
                ? await SaveNewAttributeAsync(ResolveAttributeType(typeResult.Data))
                : ServiceResult<AppAttribute?>.Failure(typeResult.Message, typeResult.ErrorCode);
        }

        private async Task<ServiceResult<AppAttribute?>> SaveNewAttributeAsync(AppAttribute? attribute)
        {
            if (attribute == null) return ServiceResult<AppAttribute?>.Failure("Unsupported attribute type.", "INVALID_TYPE");
            db.Attributes.Add(attribute);
            await db.SaveChangesAsync();
            return ServiceResult<AppAttribute?>.Success(attribute, "Attribute created successfully.");
        }

        private AppAttribute? ResolveAttributeType(AttributeType at)
        {
            if (AttributeTypes.All.Contains(at.Name))
            {
                return new AppAttribute { Type = at, TypeId = at.Id };
            }
            return null;
        }

        public async Task<ServiceResult<AttributeType>> GetAttributeTypeByNameAsync(string name)
        {
            var type = await db.AttributeTypes.FindAsync(name);
            if (type == null)
            {
                return ServiceResult<AttributeType>.Failure("Attribute type not found.", "NOT_FOUND");
            }
            return ServiceResult<AttributeType>.Success(type, "Attribute type retrieved successfully.");
        }

        public async Task<ServiceResult<AppAttribute?>> GetByIdAsync(Guid id)
        {
            var attribute = await db.Attributes.FindAsync(id);
            return attribute != null
                ? ServiceResult<AppAttribute?>.Success(attribute, "Attribute retrieved successfully.")
                : ServiceResult<AppAttribute?>.Failure("Attribute not found.", "NOT_FOUND");
        }
    }
}