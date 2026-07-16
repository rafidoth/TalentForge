using server.Dto;

namespace server.Services.ProjectsServices
{
    public interface IProjectsService
    {
        Task<ProjectDto> CreateProjectAsync(string userId, CreateProjectDto dto);
        Task<List<ProjectDto>> GetAllProjectsByUserAsync(string userId);
        Task<ProjectDto> UpdateProjectAsync(string userId, Guid projectId, UpdateProjectDto dto);
        Task DeleteProjectAsync(string userId, Guid projectId);
    }
}