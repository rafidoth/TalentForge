using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using server.Data;
using server.Dto;
using server.ServiceResults;

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

    public async Task<ServiceResult<ExternalLoginResponse>> ExternalLoginSignInAsync(string loginProvider, string providerKey, bool isPersistent)
    {
        var result = await signInManager.ExternalLoginSignInAsync(
            loginProvider,
            providerKey,
            isPersistent: isPersistent,
            bypassTwoFactor: true
        );
        string? userId = null;
        if (result.Succeeded)
        {
            var user = await signInManager.UserManager.FindByLoginAsync(loginProvider, providerKey);
            userId = user?.Id;
        }
        return ServiceResult<ExternalLoginResponse>.Success(
            new ExternalLoginResponse(result.Succeeded, userId ?? string.Empty, Roles.Candidate),
            result.Succeeded ? "External login successful." : "External login failed."
        );
    }

    public async Task<ServiceResult<ExternalLoginResponse>> CreateExternalUserAsync(ExternalLoginInfo info)
    {
        var email = info.Principal.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(email))
            return ServiceResult<ExternalLoginResponse>.Failure("Email not received from external provider.", "EmailNotFound");

        var existingUser = await GetUserByEmailAsync(email);
        if (existingUser != null)
        {
            var loginResult = await signInManager.UserManager.AddLoginAsync(existingUser, info);
            if (loginResult.Succeeded)
            {
                await signInManager.UserManager.UpdateAsync(existingUser);
            }
            return ServiceResult<ExternalLoginResponse>.Failure("Failed to add external login.", "ExternalLoginFailed");
        }

        var user = new IdentityUser
        {
            UserName = email,
            Email = email,
            EmailConfirmed = true,
        };

        var result = await signInManager.UserManager.CreateAsync(user);
        if (!result.Succeeded)
            return ServiceResult<ExternalLoginResponse>.Failure("Failed to create user.", "UserCreationFailed");

        result = await signInManager.UserManager.AddToRoleAsync(user, Roles.Candidate);
        if (!result.Succeeded)
            return ServiceResult<ExternalLoginResponse>.Failure("Failed to assign role to user.", "RoleAssignmentFailed");

        result = await signInManager.UserManager.AddLoginAsync(user, info);
        if (result.Succeeded)
            await signInManager.SignInAsync(user, isPersistent: false);

        return ServiceResult<ExternalLoginResponse>.Success(
            new ExternalLoginResponse(true, user.Id, Roles.Candidate),
            "User created and logged in successfully."
        );
    }

    public async Task<IdentityUser?> GetUserByEmailAsync(string email)
    {
        var user = await signInManager.UserManager.FindByEmailAsync(email);
        return user;
    }

    public async Task<ServiceResult<LoginResponse>> LoginAsync(LoginDto loginDto)
    {
        var user = await signInManager.UserManager.FindByEmailAsync(loginDto.Email);
        if (user == null)
        {
            return ServiceResult<LoginResponse>.Failure("Invalid login attempt.", "InvalidCredentials");
        }

        var result = await signInManager.PasswordSignInAsync(
            user,
            loginDto.Password,
            isPersistent: false,
            lockoutOnFailure: true
        );

        if (result.Succeeded)
        {
            var roles = await signInManager.UserManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? Roles.Candidate;

            return ServiceResult<LoginResponse>.Success(
                new LoginResponse(true, user.Id, role),
                "Login successful."
            );
        }
        return ServiceResult<LoginResponse>.Failure("Invalid login attempt.", "InvalidCredentials");
    }
}
