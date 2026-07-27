using server.Dto;
using server.Entities;

namespace server.Services.ProfileServices
{
    public partial class ProfileService
    {

        public async Task<CandidateFullProfileDto> GetCandidateFullProfileAsync(ApplicationUser user)
        {
            var allCvs = await cvService.GetAllCvsByCandidateIdAsync(user.Id);
            return new CandidateFullProfileDto
            {
                CandidateId = user.Id,
                InfoSection = BuildInfoSection(user),
                MeSection = await GetMeSectionAsync(user.Id),
                Attributes = await GetNonBuiltInAttributesAsync(user.Id),
                Projects = await projectsService.GetAllProjectsByUserAsync(user.Id),
                Cvs = allCvs.Where(cv => cv.IsPublished == true).ToList()
            };
        }


        private InfoSectionDto BuildInfoSection(ApplicationUser user)
            => new()
            {
                Email = user.Email ?? "",
                Status = user.Status,
                JoinedAt = user.JoinedAt
            };
    }
}