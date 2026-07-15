using Microsoft.EntityFrameworkCore;
using server.Dto;
using server.Entities;
using server.Exceptions;

namespace server.Services.ProfileServices
{
    public partial class ProfileService
    {
        public async Task UpdateAttributeValueInProfileAsync(
                string userId,
                UpdateProfileAttributeValueDto dto
        )
        {
            var profileAttribute = await GetProfileAttrbuteEntityAsync(userId, dto);
            try
            {
                await ValidateAndUpdateFields(profileAttribute, dto);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw new ConflictException("Refresh and Try Again");
            }
        }

        private async Task ValidateAndUpdateFields(
                ProfileAttribute pa,
                UpdateProfileAttributeValueDto dto
        )
        {
            ValidateAttributeValueType(pa.Attribute, dto.Value);
            UpdateProfileAttributeFields(pa, dto);
            await db.SaveChangesAsync();
        }
        private void UpdateProfileAttributeFields(
                ProfileAttribute profileAttribute,
                UpdateProfileAttributeValueDto dto
        )
        {
            profileAttribute.Value = dto.Value;
            profileAttribute.UpdatedAt = DateTime.UtcNow;
            db.Entry(profileAttribute).Property<uint>("Version").OriginalValue = dto.Version;
        }

        private async Task<ProfileAttribute> GetProfileAttrbuteEntityAsync(
                string userId,
                UpdateProfileAttributeValueDto dto
        )
        {
            var profileAttribute = await db.ProfileAttributes
                .Include(pa => pa.Attribute)
                    .ThenInclude(a => a.DropdownOptions)
                .Include(pa => pa.Attribute)
                    .ThenInclude(a => a.Type)
                .Include(pa => pa.Attribute)
                    .ThenInclude(a => a.Category)
                .FirstOrDefaultAsync(pa => pa.Id == dto.ProfileAttributeId && pa.UserId == userId) ??
                throw new NotFoundException(nameof(ProfileAttribute), dto.ProfileAttributeId.ToString());
            return profileAttribute;
        }
    }

}
