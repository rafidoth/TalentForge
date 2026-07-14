using System.Text.Json;
using server.Dto;
using server.Entities;

namespace server.Services.ProfileServices
{
    public interface IProfileService
    {
        Task<MeSectionDto> GetMeSectionAsync(string userId);
        Task<MeSectionDto> UpdateMeSectionAsync(ApplicationUser user, UpdateMeSectionDto dto);

        Task<List<ProfileAttributeDto>> GetInfoSectionAsync(string userId);
        Task AddAttributeToProfileAsync(string userId, AddProfileAttributeDto dto);
        Task<bool> RemoveAttributeFromProfileAsync(string userId, Guid profileAttributeId);
        Task<ProfileAttributeDto> UpdateProfileAttributeValueAsync(string userId, UpdateProfileAttributeValueDto dto);

        Task<List<ProjectDto>> GetProjectsAsync(string userId);
        Task<ProjectDto> CreateProjectAsync(string userId, CreateProjectDto dto);
        Task<ProjectDto> UpdateProjectAsync(string userId, Guid projectId, UpdateProjectDto dto);
        Task<bool> DeleteProjectAsync(string userId, Guid projectId);

        Task<FullProfileDto> GetFullProfileAsync(string userId);

        Task<AutoSaveResultDto> AutoSaveAsync(string userId, AutoSaveDto dto);

        Task<bool> CreateMeSectionAsync(JsonElement FName, JsonElement LName, JsonElement Location, string userId);
    }
}