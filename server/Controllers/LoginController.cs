using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server.Dto;
using server.services.AuthService;

namespace server.Controllers;

[ApiController]
[Route("api/users")]
public class LoginController(IAuthService authService) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        var result = await authService.LoginAsync(loginDto);
        if (result.IsSuccess)
        {
            return Ok(result.Data);
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
            controller: nameof(LoginController).Replace("Controller", ""),
            values: new { returnUrl = returnUrl }
        );

        var properties = authService.ConfigureExternalLogin(provider, redirectUrl);
        return new ChallengeResult(provider, properties);
    }

    [HttpGet("login/google/callback")]
    [AllowAnonymous]
    public async Task<IActionResult> ExternalLoginCallback(string returnUrl = "/", string? remoteError = null)
    {
        if (remoteError != null)
        {
            return Redirect($"{returnUrl}/login?error={Uri.EscapeDataString(remoteError)}");
        }

        var info = await authService.GetExternalLoginInfoAsync();
        if (info == null)
        {
            return Redirect($"{returnUrl}/login?error=GoogleAuthFailed");
        }

        var result = await authService.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, false);
        if (result.IsSuccess)
        {
            return Redirect($"{returnUrl}/login/success?userId={result.Data?.UserId}");
        }

        var createResult = await authService.CreateExternalUserAsync(info);
        if (createResult.IsSuccess)
        {
            return Redirect($"{returnUrl}/login/success?userId={createResult.Data?.UserId}");
        }

        return Redirect($"{returnUrl}/login?error=GoogleAuthFailed");
    }
}