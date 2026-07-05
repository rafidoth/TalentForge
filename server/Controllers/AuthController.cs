using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server.Dto;
using server.Services.UserServices;

namespace server.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IAuthService authService) : ControllerBase
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
        return Ok(new
        {
            userId = user.Id,
            email = user.Email,
            role = role ?? "Candidate"
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
        var result = await authService.LoginAsync(loginDto);
        if (result.IsSuccess)
        {
            return Ok(new { success = true });
        }

        if (result.ErrorCode == "InvalidCredentials")
        {
            return Unauthorized(result.Message);
        }
        return Unauthorized();
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

        var result = await authService.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, false);
        if (result.IsSuccess)
        {
            return Redirect($"{returnUrl}login/success");
        }

        var createResult = await authService.CreateExternalUserAsync(info);
        if (createResult.IsSuccess)
        {
            return Redirect($"{returnUrl}login/success");
        }

        return Redirect($"{returnUrl}login?error=GoogleAuthFailed");
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto request)
    {
        var result = await authService.RegisterAsync(request);
        if (result.IsSuccess)
        {
            return Ok(new { success = true });
        }

        return BadRequest(new { message = result.Message });
    }
}
