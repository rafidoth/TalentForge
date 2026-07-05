using server.Dto;
using server.ServiceResults;

namespace server.Services.ProfileServices
{
    public interface IProfileService
    {
        Task<ServiceResult<MeSectionDto>> GetMeSectionAsync(string userId);
        Task<ServiceResult<MeSectionDto>> UpdateMeSectionAsync(string userId, UpdateMeSectionDto dto);

        Task<ServiceResult<List<ProfileAttributeDto>>> GetInfoSectionAsync(string userId);
        Task<ServiceResult<ProfileAttributeDto>> AddAttributeToProfileAsync(string userId, AddProfileAttributeDto dto);
        Task<ServiceResult<bool>> RemoveAttributeFromProfileAsync(string userId, Guid profileAttributeId);
        Task<ServiceResult<ProfileAttributeDto>> UpdateProfileAttributeValueAsync(string userId, UpdateProfileAttributeValueDto dto);

        Task<ServiceResult<List<ProjectDto>>> GetProjectsAsync(string userId);
        Task<ServiceResult<ProjectDto>> CreateProjectAsync(string userId, CreateProjectDto dto);
        Task<ServiceResult<ProjectDto>> UpdateProjectAsync(string userId, Guid projectId, UpdateProjectDto dto);
        Task<ServiceResult<bool>> DeleteProjectAsync(string userId, Guid projectId);

        Task<ServiceResult<FullProfileDto>> GetFullProfileAsync(string userId);

        Task<ServiceResult<AutoSaveResultDto>> AutoSaveAsync(string userId, AutoSaveDto dto);
    }
}