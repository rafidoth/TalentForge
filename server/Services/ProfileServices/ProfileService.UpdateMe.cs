using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using server.Dto;
using server.Entities;
using server.Exceptions;

namespace server.Services.ProfileServices
{
    public partial class ProfileService
    {
        public async Task<MeSectionDto> UpdateMeSectionAsync(
            ApplicationUser user,
            UpdateMeSectionDto dto
        )
        {
            try
            {
                await UpdateMeSectionAttributes(user, dto.Attributes);
                return await GetMeSectionAsync(user.Id);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw new ConflictException("Refresh and Try Again");
            }
        }

        private async Task UpdateMeSectionAttributes(
            ApplicationUser user, List<UpdateProfileAttributeValueDto> updates
        )
        {
            var profileAttributeIds = updates.Select(a => a.ProfileAttributeId).ToList();
            var profileAttributes = await GetProfileAttributesByIdsAsync(user.Id, profileAttributeIds);
            ApplyUpdatesToProfileAttributes(profileAttributes, updates);
            await db.SaveChangesAsync();
        }

        private void ApplyUpdatesToProfileAttributes(
            List<ProfileAttribute> profileAttributes, List<UpdateProfileAttributeValueDto> updates
        )
        {
            foreach (var update in updates)
            {
                var profileAttribute = profileAttributes.First(pa => pa.Id == update.ProfileAttributeId);
                UpdateProfileAttributeValue(profileAttribute, update.Value, update.Version);
            }
        }

        private void UpdateProfileAttributeValue(ProfileAttribute profileAttribute, JsonElement newValue, uint existingVersion)
        {
            profileAttribute.Value = newValue;
            profileAttribute.UpdatedAt = DateTime.UtcNow;

            db.Entry(profileAttribute).Property<uint>("Version").OriginalValue = existingVersion;
        }

        private async Task<List<ProfileAttribute>> GetProfileAttributesByIdsAsync(string userId, List<Guid> profileAttributeIds)
        {
            var profileAttributes = await db.ProfileAttributes
                .Include(pa => pa.Attribute)
                .Where(pa => pa.UserId == userId && profileAttributeIds.Contains(pa.Id))
                .ToListAsync();

            CheckMissingProfileAttributeIds(profileAttributes, profileAttributeIds);

            return profileAttributes;
        }

        private void CheckMissingProfileAttributeIds(
            List<ProfileAttribute> profileAttributes, List<Guid> expectedProfileAttributeIds
        )
        {
            if (profileAttributes.Count != expectedProfileAttributeIds.Count)
            {
                var foundIds = profileAttributes.Select(pa => pa.Id).ToHashSet();
                var missingIds = expectedProfileAttributeIds.Where(id => !foundIds.Contains(id)).ToList();
                throw new NotFoundException(nameof(ProfileAttribute), string.Join(", ", missingIds));
            }
        }
    }
}
