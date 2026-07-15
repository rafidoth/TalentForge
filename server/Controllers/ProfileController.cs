using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server.Dto;
using server.Entities;
using server.Services.ProfileServices;

namespace server.Controllers
{

    [Authorize]
    [ApiController]
    [Route("api/profile")]
    public class ProfileController(
        IProfileService profileService,
        UserManager<ApplicationUser> userManager
    ) : ControllerBase
    {

        [HttpGet("me")]
        public async Task<IActionResult> Me()
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
            return Ok();
        }

        [HttpPost("projects")]
        public async Task<IActionResult> AddProject()
        {
            return Ok();
        }

        [HttpPut("projects")]
        public async Task<IActionResult> UpdateProject()
        {
            return Ok();
        }

        [HttpDelete("projects")]
        public async Task<IActionResult> RemoveProject()
        {
            return Ok();
        }



    }


}
