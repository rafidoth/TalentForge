using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Dto;
using server.Services.UserServices;

namespace server.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(
    IAuthService authService,
    IUserPreferenceService userPreferenceService
) : ControllerBase
{
    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var user = await authService.GetUserByClaimsPrincipalAsync(User);
        if (user == null)
        {
            return Unauthorized();
        }

        var role = await authService.GetUserRoleAsync(user);
        var pref = await userPreferenceService.GetPreferenceAsync(user.Id);
        return Ok(new
        {
            userId = user.Id,
            email = user.Email,
            role = role ?? "Candidate",
            preference = pref
        });
    }


    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await authService.LogoutAsync();
        return Ok();
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        await authService.LoginAsync(loginDto);
        return Ok(new { success = true });
    }

    [AllowAnonymous]
    [HttpGet("login/google")]
    public IActionResult ExternalLogin([FromQuery] string provider, [FromQuery] string? returnUrl = "/")
    {
        var redirectUrl = Url.Action(
            action: nameof(ExternalLoginCallback),
            controller: nameof(AuthController).Replace("Controller", ""),
            values: new { returnUrl = returnUrl }
        );

        var properties = authService.ConfigureExternalLogin(provider, redirectUrl);
        return new ChallengeResult(provider, properties);
    }

    [AllowAnonymous]
    [HttpGet("login/google/callback")]
    public async Task<IActionResult> ExternalLoginCallback(string returnUrl = "/", string? remoteError = null)
    {
        if (remoteError != null)
        {
            return Redirect($"{returnUrl}login?error={Uri.EscapeDataString(remoteError)}");
        }

        var info = await authService.GetExternalLoginInfoAsync();
        if (info == null)
        {
            return Redirect($"{returnUrl}login?error=GoogleAuthFailed");
        }

        try
        {
            await authService.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, false);
            return Redirect($"{returnUrl}login/success");
        }
        catch
        {
            try
            {
                await authService.CreateExternalUserAsync(info);
                return Redirect($"{returnUrl}login/success");
            }
            catch
            {
                return Redirect($"{returnUrl}login?error=GoogleAuthFailed");
            }
        }
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto request)
    {
        await authService.RegisterAsync(request);
        return Ok(new { success = true });
    }
}
