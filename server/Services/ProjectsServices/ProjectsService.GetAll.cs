using Microsoft.EntityFrameworkCore;
using server.Dto;

namespace server.Services.ProjectsServices
{
    public partial class ProjectsService
    {
        public async Task<List<ProjectDto>> GetAllProjectsByUserAsync(string userId)
        {
            var projects = await LoadProjectsByUserAsync(userId);
            return projects.Select(MapToProjectDto).ToList();
        }

        private async Task<List<Entities.Project>> LoadProjectsByUserAsync(string userId)
        {
            return await db.Projects
                .Where(p => p.UserId == userId)
                .Include(p => p.ProjectTechnologyTags).ThenInclude(pt => pt.Tag)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }
    }
}
