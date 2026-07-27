using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using server.Dto;
using server.Entities;

namespace server.Services.UserServices;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginDto loginDto);
    AuthenticationProperties ConfigureExternalLogin(string provider, string? redirectUrl);
    Task<ExternalLoginInfo?> GetExternalLoginInfoAsync();
    Task<ExternalLoginResponse> ExternalLoginSignInAsync(string loginProvider, string providerKey, bool isPersistent);
    Task<ExternalLoginResponse> CreateExternalUserAsync(ExternalLoginInfo info);
    Task<ApplicationUser?> GetUserByClaimsPrincipalAsync(ClaimsPrincipal User);
    Task<string> GetUserRoleAsync(ApplicationUser user);
    Task<ApplicationUser?> GetUserByEmailAsync(string email);
    Task<ApplicationUser?> GetUserByIdAsync(string userId);
    Task<IdentityResult> CreateNewUserAsync(ApplicationUser user, string password);
    Task<IdentityResult> AssignRoleAsync(ApplicationUser user, string role);
    Task<SignInResult> SignInUserAsync(ApplicationUser user, string password, bool isPersistent);
    Task LogoutAsync();
    Task<RegisterResponse> RegisterAsync(RegisterDto request);
}