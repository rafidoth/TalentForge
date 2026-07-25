using Microsoft.AspNetCore.Identity;
using server.Dto;
using server.Entities;
using server.Exceptions;
using server.Services.CvServices;
using server.Services.ProjectsServices;

namespace server.Services.ProfileServices;

public class CandidateProfileService(
    UserManager<ApplicationUser> userManager,
    IProfileService profileService,
    IProjectsService projectsService,
    ICvService cvService
) : ICandidateProfileService
{
    public async Task<CandidateFullProfileDto> GetCandidateFullProfileAsync(string candidateId)
    {
        var user = await GetUserOrThrowAsync(candidateId);
        
        return new CandidateFullProfileDto
        {
            CandidateId = candidateId,
            InfoSection = BuildInfoSection(user),
            MeSection = await profileService.GetMeSectionAsync(candidateId),
            Attributes = await profileService.GetNonBuiltInAttributesAsync(candidateId),
            Projects = await projectsService.GetAllProjectsByUserAsync(candidateId),
            Cvs = await cvService.GetAllCvsByCandidateIdAsync(candidateId)
        };
    }

    private async Task<ApplicationUser> GetUserOrThrowAsync(string candidateId)
        => await userManager.FindByIdAsync(candidateId) 
           ?? throw new NotFoundException(nameof(ApplicationUser), candidateId);

    private InfoSectionDto BuildInfoSection(ApplicationUser user)
        => new()
        {
            Email = user.Email ?? "",
            Status = user.Status,
            JoinedAt = user.JoinedAt
        };
}
