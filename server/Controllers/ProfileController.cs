using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server.Services.ProfileServices;

namespace server.Controllers
{

    [Authorize]
    [ApiController]
    [Route("api/profile")]
    public class ProfileController(IProfileService profileService, UserManager<IdentityUser> userManager) : ControllerBase
    {

        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var user = await userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var profile = await profileService.GetMeSectionAsync(user.Id);
            return Ok(profile);
        }

    }
}