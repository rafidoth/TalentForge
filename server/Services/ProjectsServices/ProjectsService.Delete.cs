using server.Entities;
using server.Exceptions;

namespace server.Services.ProjectsServices
{
    public partial class ProjectsService
    {
        public async Task DeleteProjectAsync(string userId, Guid projectId)
        {
            var project = await FindOwnedProjectAsync(userId, projectId);
            db.Projects.Remove(project);
            await db.SaveChangesAsync();
        }
    }
}
