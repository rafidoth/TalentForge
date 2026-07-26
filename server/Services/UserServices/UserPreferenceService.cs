using Microsoft.EntityFrameworkCore;
using server.Dto;
using server.Entities;
using server.Exceptions;

namespace server.Services.UserServices
{
    public class UserPreferenceService(ApplicationDbContext db) : IUserPreferenceService
    {
        private static UserPreferenceDto MapToDto(UserPreference preference)
        {
            return new UserPreferenceDto
            {
                Theme = preference.Theme ?? "light",
                Language = preference.Language ?? "en"
            };
        }

        private UserPreference BuildDefaultUserPreference(string userId)
        {
            return new UserPreference
            {
                UserId = userId,
                Theme = "light",
                Language = "en",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
        }

        public async Task<UserPreferenceDto> CreateDefaultPreferenceAsync(string userId)
        {
            var preference = BuildDefaultUserPreference(userId);
            db.UserPreferences.Add(preference);
            await db.SaveChangesAsync();
            return MapToDto(preference);
        }

        public async Task<UserPreferenceDto> GetPreferenceAsync(string userId)
        {
            var preference = await db.UserPreferences.FirstOrDefaultAsync(p => p.UserId == userId);

            if (preference == null)
                return await CreateDefaultPreferenceAsync(userId);

            return MapToDto(preference);
        }

        public async Task<UserPreferenceDto> UpdateThemeAsync(string userId, string theme)
        {
            var preference = await db.UserPreferences.FirstOrDefaultAsync(p => p.UserId == userId);
            if (preference == null)
                return await CreateDefaultPreferenceAsync(userId);

            preference.Theme = theme;
            preference.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();
            return MapToDto(preference);
        }



    }
}