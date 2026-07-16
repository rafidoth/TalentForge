using server.Dto;
using server.Entities;

namespace server.Services.ProjectsServices
{
    public partial class ProjectsService
    {
        public async Task<ProjectDto> CreateProjectAsync(string userId, CreateProjectDto dto)
        {
            var project = BuildProjectEntity(userId, dto);
            await AttachTagsToProjectAsync(project, dto.Tags);
            await db.Projects.AddAsync(project);
            await db.SaveChangesAsync();
            return MapToProjectDto(project);
        }

        private static Project BuildProjectEntity(string userId, CreateProjectDto dto) => new()
        {
            UserId = userId,
            Name = dto.Name,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Description = dto.Description,
        };

        private async Task AttachTagsToProjectAsync(Project project, List<Guid>? tagIds)
        {
            if (tagIds == null || tagIds.Count == 0) return;
            var tags = await ResolveTagsAsync(tagIds);
            project.ProjectTechnologyTags = BuildProjectTechnologyTags(project.Id, tags);
        }
    }
}
