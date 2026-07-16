using Microsoft.EntityFrameworkCore;
using server.Dto;
using server.Entities;
using server.Exceptions;

namespace server.Services.ProjectsServices
{
    public partial class ProjectsService
    {
        public async Task<ProjectDto> UpdateProjectAsync(string userId, Guid projectId, UpdateProjectDto dto)
        {
            try
            {
                var project = await FindOwnedProjectAsync(userId, projectId);
                ApplyProjectUpdates(project, dto);
                await ReplaceProjectTagsAsync(project, dto.Tags);
                SetConcurrencyVersion(project, dto.Version);
                await db.SaveChangesAsync();
                return MapToProjectDto(project);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw new ConflictException("Refresh and Try Again");
            }
        }

        private static void ApplyProjectUpdates(Project project, UpdateProjectDto dto)
        {
            if (!string.IsNullOrWhiteSpace(dto.Name)) project.Name = dto.Name;
            if (dto.StartDate.HasValue) project.StartDate = dto.StartDate;
            if (dto.EndDate.HasValue) project.EndDate = dto.EndDate;
            if (dto.Description != null) project.Description = dto.Description;
            project.UpdatedAt = DateTime.UtcNow;
        }

        private async Task ReplaceProjectTagsAsync(Project project, List<Guid>? tagIds)
        {
            if (tagIds == null) return;
            db.ProjectTechnologyTags.RemoveRange(project.ProjectTechnologyTags);
            var tags = await ResolveTagsAsync(tagIds);
            project.ProjectTechnologyTags = BuildProjectTechnologyTags(project.Id, tags);
        }

        private void SetConcurrencyVersion(Project project, uint version)
        {
            db.Entry(project).Property<uint>("Version").OriginalValue = version;
        }
    }
}
