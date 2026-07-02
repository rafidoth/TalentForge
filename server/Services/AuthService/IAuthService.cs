using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using server.Dto;
using server.ServiceResults;

namespace server.services.AuthService;




public interface IAuthService
{

    Task<ServiceResult<LoginResponse>> LoginAsync(LoginDto loginDto);
    AuthenticationProperties ConfigureExternalLogin(string provider, string? redirectUrl);
    Task<ExternalLoginInfo?> GetExternalLoginInfoAsync();
    Task<ServiceResult<ExternalLoginResponse>> ExternalLoginSignInAsync(string loginProvider, string providerKey, bool isPersistent);
    Task<ServiceResult<ExternalLoginResponse>> CreateExternalUserAsync(ExternalLoginInfo info);
}