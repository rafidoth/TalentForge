using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;

namespace server.services.AuthService;



public class AuthService(SignInManager<IdentityUser> signInManager) : IAuthService
{
    public AuthenticationProperties ConfigureExternalLogin(string provider, string? redirectUrl)
    {
        return signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
    }

    public async Task<ExternalLoginInfo?> GetExternalLoginInfoAsync()
    {
        return await signInManager.GetExternalLoginInfoAsync();
    }

    public async Task<SignInResult> ExternalLoginSignInAsync(string loginProvider, string providerKey, bool isPersistent)
    {
        return await signInManager.ExternalLoginSignInAsync(
            loginProvider,
            providerKey,
            isPersistent: isPersistent,
            bypassTwoFactor: true
        );
    }

    public async Task<IdentityResult> CreateExternalUserAsync(ExternalLoginInfo info)
    {
        var email = info.Principal.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(email))
            return IdentityResult.Failed(new IdentityError { Description = "Email not received from external provider." });

        var existingUser = await GetUserByEmailAsync(email);
        if (existingUser != null)
        {
            var loginResult = await signInManager.UserManager.AddLoginAsync(existingUser, info);
            if (loginResult.Succeeded)
            {
                await signInManager.UserManager.UpdateAsync(existingUser);
            }
            return loginResult;
        }

        var user = new IdentityUser
        {
            UserName = email,
            Email = email,
            EmailConfirmed = true,
        };

        var result = await signInManager.UserManager.CreateAsync(user);
        if (!result.Succeeded)
            return result;

        result = await signInManager.UserManager.AddLoginAsync(user, info);
        if (result.Succeeded)
            await signInManager.SignInAsync(user, isPersistent: false);

        return result;
    }

    public async Task<IdentityUser?> GetUserByEmailAsync(string email)
    {
        var user = await signInManager.UserManager.FindByEmailAsync(email);
        return user;
    }

}
