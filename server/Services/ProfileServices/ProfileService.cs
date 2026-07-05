using Microsoft.AspNetCore.Routing.Constraints;
using Microsoft.EntityFrameworkCore;
using server.Dto;
using server.Entities;
using server.ServiceResults;

namespace server.Services.ProfileServices
{
    public class ProfileService(ApplicationDbContext db) : IProfileService
    {
        public Task<ServiceResult<ProfileAttributeDto>> AddAttributeToProfileAsync(string userId, AddProfileAttributeDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResult<AutoSaveResultDto>> AutoSaveAsync(string userId, AutoSaveDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResult<ProjectDto>> CreateProjectAsync(string userId, CreateProjectDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResult<bool>> DeleteProjectAsync(string userId, Guid projectId)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResult<FullProfileDto>> GetFullProfileAsync(string userId)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResult<List<ProfileAttributeDto>>> GetInfoSectionAsync(string userId)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResult<MeSectionDto>> GetMeSectionAsync(string userId)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResult<List<ProjectDto>>> GetProjectsAsync(string userId)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResult<bool>> RemoveAttributeFromProfileAsync(string userId, Guid profileAttributeId)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResult<MeSectionDto>> UpdateMeSectionAsync(string userId, UpdateMeSectionDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResult<ProfileAttributeDto>> UpdateProfileAttributeValueAsync(string userId, UpdateProfileAttributeValueDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResult<ProjectDto>> UpdateProjectAsync(string userId, Guid projectId, UpdateProjectDto dto)
        {
            throw new NotImplementedException();
        }
    }
}