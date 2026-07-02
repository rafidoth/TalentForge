using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;

namespace server.services.AuthService;




public interface IAuthService
{
    AuthenticationProperties ConfigureExternalLogin(string provider, string? redirectUrl);
    Task<ExternalLoginInfo?> GetExternalLoginInfoAsync();
    Task<SignInResult> ExternalLoginSignInAsync(string loginProvider, string providerKey, bool isPersistent);
    Task<IdentityResult> CreateExternalUserAsync(ExternalLoginInfo info);
}