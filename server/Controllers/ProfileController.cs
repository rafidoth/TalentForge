using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server.Dto;
using server.Entities;
using server.Services.ProfileServices;
using server.Services.UserServices;

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

            var updatedProfile = await profileService.UpdateMeSectionAsync(user, dto);
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

    }


}