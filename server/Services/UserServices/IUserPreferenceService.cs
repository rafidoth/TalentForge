using server.Dto;

namespace server.Services.UserServices
{
    public interface IUserPreferenceService
    {
        Task<UserPreferenceDto> CreateDefaultPreferenceAsync(string userId);
        Task<UserPreferenceDto> GetPreferenceAsync(string userId);
        Task<UserPreferenceDto> UpdateThemeAsync(string userId, string theme);

    }
}