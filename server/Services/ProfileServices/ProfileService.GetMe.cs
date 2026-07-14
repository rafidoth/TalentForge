
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dto;
using server.Exceptions;

namespace server.Services.ProfileServices
{
    public partial class ProfileService
    {
        public async Task<MeSectionDto> GetMeSectionAsync(string userId)
        {
            var meAttributes = await db.ProfileAttributes
                .Where(pa => pa.UserId == userId && pa.Attribute.Category!.Name == "Personal Information")
                .Include(pa => pa.Attribute)
                    .ThenInclude(a => a.DropdownOptions)
                .Select(pa => new ProfileAttributeDto
                {
                    Id = pa.Id,
                    AttributeId = pa.AttributeId,
                    AttributeName = pa.Attribute.Name,
                    TypeName = pa.Attribute.Type!.Name,
                    CategoryName = pa.Attribute.Category!.Name,
                    Value = pa.Value,
                    Version = EF.Property<uint>(pa, "Version"),
                    DropdownOptions = pa.Attribute.DropdownOptions.Select(d => new DropdownOptionDto(d.Id, d.Label)).ToList()
                })
                .ToListAsync();

            return new MeSectionDto
            {
                MeAttributes = meAttributes
            };
        }
    }
}