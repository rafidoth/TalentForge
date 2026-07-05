using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using server.Dto;
using server.ServiceResults;

namespace server.Services.UserServices;




public interface IAuthService
{

    Task<ServiceResult<LoginResponse>> LoginAsync(LoginDto loginDto);
    AuthenticationProperties ConfigureExternalLogin(string provider, string? redirectUrl);
    Task<ExternalLoginInfo?> GetExternalLoginInfoAsync();
    Task<ServiceResult<ExternalLoginResponse>> ExternalLoginSignInAsync(string loginProvider, string providerKey, bool isPersistent);
    Task<ServiceResult<ExternalLoginResponse>> CreateExternalUserAsync(ExternalLoginInfo info);
    Task<IdentityUser?> GetUserByClaimsPrincipalAsync(ClaimsPrincipal User);
    Task<string> GetUserRoleAsync(IdentityUser user);
    Task<IdentityUser?> GetUserByEmailAsync(string email);
    Task<IdentityResult> CreateNewUserAsync(IdentityUser user, string password);
    Task<IdentityResult> AssignRoleAsync(IdentityUser user, string role);
    Task<SignInResult> SignInUserAsync(IdentityUser user, string password, bool isPersistent);
    Task LogoutAsync();
    Task<ServiceResult<RegisterResponse>> RegisterAsync(RegisterDto request);
}