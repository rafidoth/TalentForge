using System.Text.Json;
using server.Dto;
using server.Entities;

namespace server.Services.ProfileServices
{
    public interface IProfileService
    {
        Task<MeSectionDto> GetMeSectionAsync(string userId);
        Task<MeSectionDto> UpdateMeSectionAsync(ApplicationUser user, UpdateMeSectionDto dto);
        Task<List<ProfileAttributeDto>> GetNonBuiltInAttributesAsync(string userId);
        Task AddAttributeToProfileAsync(string userId, AddProfileAttributeDto dto);
        Task<bool> DeleteAttributeFromProfileAsync(string userId, Guid profileAttributeId);
        Task UpdateAttributeValueInProfileAsync(string userId, UpdateProfileAttributeValueDto dto);
        Task<bool> CreateMeSectionAsync(JsonElement FName, JsonElement LName, JsonElement Location, string userId);
    }
}
