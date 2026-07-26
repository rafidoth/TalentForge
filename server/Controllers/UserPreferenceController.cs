using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Services.UserServices;

namespace server.Controllers
{
    [ApiController]
    [Route("api/preferences")]
    public class UserPreferenceController(
        IAuthService authService,
        IUserPreferenceService userPreferenceService
    ) : ControllerBase
    {
        [Authorize]
        [HttpPut("theme")]
        public async Task<IActionResult> UpdateTheme([FromQuery] string theme)
        {
            var user = await authService.GetUserByClaimsPrincipalAsync(User);
            if (user == null)
                return Unauthorized();
            var preference = await userPreferenceService.UpdateThemeAsync(user.Id, theme);
            return Ok(preference);
        }
    }
}