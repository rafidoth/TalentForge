using Microsoft.EntityFrameworkCore;
using server.Dto;

namespace server.Services.ProfileServices
{
    public partial class ProfileService
    {
        public async Task<CandidatePositionAttributesDto?> GetCandidateAttributesForPositionAsync(string userId, Guid positionId)
        {
            var positionExists = await db.Positions.AnyAsync(p => p.Id == positionId);
            if (!positionExists) return null;

            var requiredAttributeIds = await db.PositionAttributes
                .Where(pa => pa.PositionId == positionId)
                .Select(pa => pa.AttributeId)
                .ToListAsync();

            if (!requiredAttributeIds.Any())
            {
                return new CandidatePositionAttributesDto();
            }

            var filledProfileAttributes = await db.ProfileAttributes
                .Include(pa => pa.Attribute)
                    .ThenInclude(a => a.Type)
                .Include(pa => pa.Attribute)
                    .ThenInclude(a => a.Category)
                .Include(pa => pa.Attribute)
                    .ThenInclude(a => a.DropdownOptions)
                .Where(pa => pa.UserId == userId && requiredAttributeIds.Contains(pa.AttributeId))
                .ToListAsync();

            var filledAttributeIds = filledProfileAttributes.Select(pa => pa.AttributeId).ToHashSet();
            var missingAttributeIds = requiredAttributeIds.Where(id => !filledAttributeIds.Contains(id)).ToList();

            var missingAttributes = await db.Attributes
                .Include(a => a.Type)
                .Include(a => a.Category)
                .Include(a => a.DropdownOptions)
                .Where(a => missingAttributeIds.Contains(a.Id))
                .ToListAsync();

            return new CandidatePositionAttributesDto
            {
                FilledAttributes = filledProfileAttributes.Select(pa => new ProfileAttributeDto
                {
                    Id = pa.Id,
                    AttributeId = pa.AttributeId,
                    AttributeName = pa.Attribute.Name,
                    TypeName = pa.Attribute.Type?.Name ?? string.Empty,
                    CategoryName = pa.Attribute.Category?.Name ?? string.Empty,
                    IsBuiltin = pa.Attribute.IsBuiltin,
                    Value = pa.Value,
                    Version = db.Entry(pa).Property<uint>("Version").CurrentValue,
                    DropdownOptions = pa.Attribute.DropdownOptions?.Select(d => new DropdownOptionDto(d.Id, d.Label)).ToList()
                }).ToList(),

                MissingAttributes = missingAttributes.Select(a => new AttributeDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    Description = a.Description ?? string.Empty,
                    TypeId = a.TypeId.GetValueOrDefault(),
                    TypeName = a.Type?.Name ?? string.Empty,
                    CategoryId = a.CategoryId.GetValueOrDefault(),
                    CategoryName = a.Category?.Name ?? string.Empty,
                    IsBuiltin = a.IsBuiltin,
                    Version = db.Entry(a).Property<uint>("Version").CurrentValue,
                    DropdownOptions = a.DropdownOptions?.Select(d => new DropdownOptionDto(d.Id, d.Label)).ToList()
                }).ToList()
            };
        }
    }
}
