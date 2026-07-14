using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dto;
using server.Entities;
using server.Exceptions;
using server.Services.AttributeLibraryServices;
using server.Services.UserServices;

namespace server.Services.ProfileServices
{
    public partial class ProfileService(
        ApplicationDbContext db,
        IAttributeService attrs,
        IConfiguration cfg,
        ILogger<ProfileService> logger
        ) : IProfileService
    {

        private ProfileAttribute BuildProfileAttribute(JsonElement value, string userId, AppAttribute attr)
        {
            return new ProfileAttribute
            {
                UserId = userId,
                AttributeId = attr.Id,
                Value = value,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };

        }

        public Task<AutoSaveResultDto> AutoSaveAsync(string userId, AutoSaveDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<ProjectDto> CreateProjectAsync(string userId, CreateProjectDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteProjectAsync(string userId, Guid projectId)
        {
            throw new NotImplementedException();
        }

        public Task<FullProfileDto> GetFullProfileAsync(string userId)
        {
            throw new NotImplementedException();
        }

        public Task<List<ProfileAttributeDto>> GetInfoSectionAsync(string userId)
        {
            throw new NotImplementedException();
        }


        public Task<List<ProjectDto>> GetProjectsAsync(string userId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> RemoveAttributeFromProfileAsync(string userId, Guid profileAttributeId)
        {
            throw new NotImplementedException();
        }




        public Task<ProfileAttributeDto> UpdateProfileAttributeValueAsync(string userId, UpdateProfileAttributeValueDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<ProjectDto> UpdateProjectAsync(string userId, Guid projectId, UpdateProjectDto dto)
        {
            throw new NotImplementedException();
        }
    }
}