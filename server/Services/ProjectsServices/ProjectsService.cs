using Microsoft.EntityFrameworkCore;
using server.Dto;
using server.Entities;
using server.Exceptions;

namespace server.Services.ProjectsServices
{
    public partial class ProjectsService(ApplicationDbContext db) : IProjectsService
    {
        private async Task<List<TechnologyTag>> ResolveTagsAsync(List<Guid> tagIds)
        {
            var tags = await db.TechnologyTags.Where(t => tagIds.Contains(t.Id)).ToListAsync();
            EnsureAllTagsFound(tagIds, tags);
            return tags;
        }

        private static void EnsureAllTagsFound(List<Guid> requestedIds, List<TechnologyTag> foundTags)
        {
            var missingIds = requestedIds.Except(foundTags.Select(t => t.Id)).ToList();
            if (missingIds.Any())
                throw new NotFoundException(nameof(TechnologyTag), string.Join(", ", missingIds));
        }

        private static List<ProjectTechnologyTag> BuildProjectTechnologyTags(Guid projectId, List<TechnologyTag> tags)
        {
            return tags.Select(t => new ProjectTechnologyTag { ProjectId = projectId, TagId = t.Id, Tag = t }).ToList();
        }

        private async Task<Project> FindOwnedProjectAsync(string userId, Guid projectId)
        {
            return await db.Projects
                .Include(p => p.ProjectTechnologyTags).ThenInclude(pt => pt.Tag)
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId)
                ?? throw new NotFoundException(nameof(Project), projectId);
        }

        private ProjectDto MapToProjectDto(Project project) => new()
        {
            Id = project.Id,
            Name = project.Name,
            StartDate = project.StartDate,
            EndDate = project.EndDate,
            Description = project.Description,
            Tags = project.ProjectTechnologyTags.Select(pt => new TagDto(pt.Tag.Id, pt.Tag.Name)).ToList(),
            Version = db.Entry(project).Property<uint>("Version").CurrentValue,
        };
    }
}