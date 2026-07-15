using Microsoft.EntityFrameworkCore;
using server.Dto;

namespace server.Services.ProfileServices
{
    public partial class ProfileService
    {
        public async Task<List<ProfileAttributeDto>> GetNonBuiltInAttributesAsync(string userId)
        {
            var attributes = await db.ProfileAttributes
                .Include(pa => pa.Attribute)
                    .ThenInclude(a => a.Type)
                .Include(pa => pa.Attribute)
                    .ThenInclude(a => a.Category)
                .Include(pa => pa.Attribute)
                    .ThenInclude(a => a.DropdownOptions)
                .Where(pa => pa.UserId == userId && !pa.Attribute.IsBuiltin)
                .Select(pa => new ProfileAttributeDto
                {
                    Id = pa.Id,
                    AttributeId = pa.AttributeId,
                    AttributeName = pa.Attribute.Name,
                    TypeName = pa.Attribute.Type!.Name,
                    CategoryName = pa.Attribute.Category!.Name,
                    Value = pa.Value,
                    Version = EF.Property<uint>(pa, "Version"),
                    DropdownOptions = pa.Attribute
                    .DropdownOptions
                    .Select(d => new DropdownOptionDto(d.Id, d.Label)).ToList()
                })
                .ToListAsync();

            return attributes;
        }
    }
}
