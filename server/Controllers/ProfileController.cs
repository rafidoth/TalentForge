using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server.Dto;
using server.Entities;
using server.Services.ProfileServices;
using server.Services.ProjectsServices;

namespace server.Controllers
{

    [Authorize]
    [ApiController]
    [Route("api/profile")]
    public class ProfileController(
        IProfileService profileService,
        IProjectsService projectsService,
        UserManager<ApplicationUser> userManager
    ) : ControllerBase
    {

        [HttpGet("me")]
        public async Task<IActionResult> GetMeSectionAttributes()
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var profile = await profileService.GetMeSectionAsync(user.Id);
            return Ok(profile);
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateMeSection(UpdateMeSectionDto dto)
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            await profileService.UpdateMeSectionAsync(user, dto);
            return Ok(new { message = "Me section updated successfully.", });
        }

        [HttpPost("attributes")]
        public async Task<IActionResult> AddAttributeToProfile(AddProfileAttributeDto dto)
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            await profileService.AddAttributeToProfileAsync(user.Id, dto);
            return Ok(new { message = "Attribute added to profile successfully." });
        }



        [HttpPut("attributes")]
        public async Task<IActionResult> UpdateAttributeValueInProfile(UpdateProfileAttributeValueDto dto)
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            await profileService.UpdateAttributeValueInProfileAsync(user.Id, dto);
            return Ok();
        }

        [HttpDelete("attributes/{id}")]
        public async Task<IActionResult> DeleteAttributeFromProfile(Guid id)
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            await profileService.DeleteAttributeFromProfileAsync(user.Id, id);
            return NoContent();
        }

        [HttpGet("attributes/non-built-in")]
        public async Task<IActionResult> GetNonBuiltInAttributes()
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            var result = await profileService.GetNonBuiltInAttributesAsync(user.Id);
            return Ok(result);
        }

        [HttpGet("projects")]
        public async Task<IActionResult> GetProjects()
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            var projects = await projectsService.GetAllProjectsByUserAsync(user.Id);
            return Ok(projects);
        }

        [HttpPost("projects")]
        public async Task<IActionResult> AddProject(CreateProjectDto dto)
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            var project = await projectsService.CreateProjectAsync(user.Id, dto);
            return Ok(project);
        }

        [HttpPut("projects/{id}")]
        public async Task<IActionResult> UpdateProject(Guid id, UpdateProjectDto dto)
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            var project = await projectsService.UpdateProjectAsync(user.Id, id, dto);
            return Ok(project);
        }

        [HttpDelete("projects/{id}")]
        public async Task<IActionResult> RemoveProject(Guid id)
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            await projectsService.DeleteProjectAsync(user.Id, id);
            return NoContent();
        }

        [HttpGet("attributes/position/{positionId}")]
        public async Task<IActionResult> GetCandidateAttributesForPosition(Guid positionId)
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var result = await profileService.GetCandidateAttributesForPositionAsync(user.Id, positionId);
            if (result == null)
            {
                return NotFound(new { message = "Position not found." });
            }

            return Ok(result);
        }

    }


}
