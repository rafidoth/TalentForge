using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server.services.AuthService;

namespace server.Controllers;




[ApiController]
[Route("api")]
public class LoginController(IAuthService authService) : ControllerBase
{
    /*     [HttpGet("login/google")]
        public async Task<IActionResult> GoogleLogin([FromQuery] string returnUrl = "/")
        {
            var redirectUrl = $"/api/login/google/callback?returnUrl={Uri.EscapeDataString(returnUrl)}";
            var properties = signInManager.ConfigureExternalAuthenticationProperties(
                "Google",
                redirectUrl
            );
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("login/google/callback")]
        public async Task<IActionResult> GoogleLoginCallback([FromQuery] string? returnUrl = "/")
        {
            var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);
            if (!result.Succeeded)
            {
                return Redirect($"{returnUrl ?? "/"}?error=Google authentication failed.");
            }

            var claimsPrincipal = result.Principal;
            if (claimsPrincipal == null)
            {
                return Redirect($"{returnUrl ?? "/"}?error=Google authentication failed. No principal found.");
            }

            var email = claimsPrincipal.FindFirstValue(ClaimTypes.Email);
            if (email == null)
            {
                return Redirect($"{returnUrl ?? "/"}?error=Google authentication failed. Email claim not found.");
            }

            var providerKey = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
            if (providerKey == null)
            {
                return Redirect($"{returnUrl ?? "/"}?error=Google authentication failed. NameIdentifier claim not found.");
            }

            // 1. Find user by Google login
            var user = await signInManager.UserManager.FindByLoginAsync("Google", providerKey);
            if (user == null)
            {
                // 2. Find or create user by email
                user = await signInManager.UserManager.FindByEmailAsync(email);
                if (user == null)
                {
                    user = new IdentityUser
                    {
                        UserName = email,
                        Email = email,
                        EmailConfirmed = true
                    };

                    var createUserResult = await signInManager.UserManager.CreateAsync(user);
                    if (!createUserResult.Succeeded)
                    {
                        return Redirect($"{returnUrl ?? "/"}?error=Failed to create user.");
                    }
                }

                // 3. Link Google account to user
                var info = new UserLoginInfo("Google", providerKey, "Google");
                var linkResult = await signInManager.UserManager.AddLoginAsync(user, info);
                if (!linkResult.Succeeded)
                {
                    return Redirect($"{returnUrl ?? "/"}?error=Failed to link Google account.");
                }
            }

            // 4. Sign the user in
            await signInManager.SignInAsync(user, isPersistent: true);

            return Redirect(returnUrl ?? "/");
        }
     */
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
        if (result.Succeeded)
        {
            return Redirect($"{returnUrl}");
        }

        var createResult = await authService.CreateExternalUserAsync(info);
        if (createResult.Succeeded)
        {
            return Redirect($"{returnUrl}");
        }

        return Redirect($"{returnUrl}/unauthorized");
    }
}