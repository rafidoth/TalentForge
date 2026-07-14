using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dto;
using server.Entities;
using server.ServiceResults;
using server.Services.ProfileServices;

namespace server.Services.UserServices;


public class AuthService(SignInManager<ApplicationUser> signInManager, IProfileService profileService, ApplicationDbContext db) : IAuthService
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
        var result = await SignInUserByExternalLogin(loginProvider, providerKey);
        string? userId = GetUserIdByExternalLoginAsync(loginProvider, providerKey);
        if (!result.Succeeded || string.IsNullOrEmpty(userId))
        {
            return ServiceResult<ExternalLoginResponse>.Failure(
                "External login failed.",
                "ExternalLoginFailed"
            );
        }

        return ServiceResult<ExternalLoginResponse>.Success(
            new ExternalLoginResponse(result.Succeeded, userId ?? string.Empty, Roles.Candidate),
            "External login successful."
        );
    }

    public async Task<SignInResult> SignInUserByExternalLogin(string loginProvider, string providerKey)
    {
        var result = await signInManager.ExternalLoginSignInAsync(
            loginProvider,
            providerKey,
            isPersistent: false,
            bypassTwoFactor: true
        );
        return result;
    }

    public string GetUserIdByExternalLoginAsync(string loginProvider, string providerKey)
    {
        var user = signInManager.UserManager.FindByLoginAsync(loginProvider, providerKey).Result;
        return user?.Id ?? string.Empty;
    }

    public async Task<ServiceResult<ExternalLoginResponse>> CreateExternalUserAsync(ExternalLoginInfo info)
    {
        var email = info.Principal.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(email))
            return GetFailureResult("Email not received from external provider.", "EmailNotFound");
        var existingUser = await GetUserByEmailAsync(email);
        if (existingUser != null)
        {
            return await LinkExistingExternalUserAsync(existingUser, info);
        }
        return await CreateAndSignInNewExternalUserAsync(email, info);
    }

    private async Task<ServiceResult<ExternalLoginResponse>> LinkExistingExternalUserAsync(ApplicationUser user, ExternalLoginInfo info)
    {
        var loginResult = await signInManager.UserManager.AddLoginAsync(user, info);
        if (loginResult.Succeeded)
        {
            await signInManager.UserManager.UpdateAsync(user);
            return GetSuccessResult(user.Id, "External login linked successfully.");
        }
        return GetFailureResult("Failed to add external login.", "ExternalLoginFailed");
    }

    private async Task<ServiceResult<ExternalLoginResponse>> CreateAndSignInNewExternalUserAsync(string email, ExternalLoginInfo info)
    {
        var user = new ApplicationUser { UserName = email, Email = email, EmailConfirmed = true };
        var result = await CreateNewUserAsync(user, string.Empty);
        if (result.Succeeded)
        {
            return await AssignRoleAndSignInAsync(user, info);
        }
        return GetFailureResult("Failed to create user.", "UserCreationFailed");
    }

    private async Task<ServiceResult<ExternalLoginResponse>> AssignRoleAndSignInAsync(ApplicationUser user, ExternalLoginInfo info)
    {
        var result = await AssignRoleAsync(user, Roles.Candidate);
        if (result.Succeeded)
        {
            return await AddLoginAndSignInAsync(user, info);
        }
        return GetFailureResult("Failed to assign role to user.", "RoleAssignmentFailed");
    }

    private async Task<ServiceResult<ExternalLoginResponse>> AddLoginAndSignInAsync(ApplicationUser user, ExternalLoginInfo info)
    {
        var result = await signInManager.UserManager.AddLoginAsync(user, info);

        if (result.Succeeded)
            await SignInUserAsync(user, string.Empty, isPersistent: true);
        return GetSuccessResult(user.Id, "User created and logged in successfully.");

    }


    public async Task<ServiceResult<LoginResponse>> LoginAsync(LoginDto loginDto)
    {
        var user = await GetUserByEmailAsync(loginDto.Email);
        if (user == null)
        {
            return ServiceResult<LoginResponse>.Failure("Invalid login attempt.", "InvalidCredentials");
        }

        var signInResult = await SignInUserAsync(user, loginDto.Password, isPersistent: false);
        if (signInResult.Succeeded)
        {
            user.LastLoginAt = DateTime.UtcNow;
            await signInManager.UserManager.UpdateAsync(user);

            var role = await GetUserRoleAsync(user);
            return ServiceResult<LoginResponse>.Success(
                new LoginResponse(true, user.Id, role),
                "Login successful."
            );
        }
        return ServiceResult<LoginResponse>.Failure("Invalid login attempt.", "InvalidCredentials");
    }

    public async Task<string> GetUserRoleAsync(ApplicationUser user)
    {
        var roles = await signInManager.UserManager.GetRolesAsync(user);
        return roles.FirstOrDefault() ?? Roles.Candidate;
    }

    public async Task<bool> SignInUserWithPasswordAsync(LoginDto loginDto, ApplicationUser user)
    {
        var result = await signInManager.PasswordSignInAsync(
            user,
            loginDto.Password,
            isPersistent: false,
            lockoutOnFailure: true
        );
        return result.Succeeded;
    }

    public async Task<ApplicationUser?> GetUserByEmailAsync(string email)
    {
        var user = await signInManager.UserManager.FindByEmailAsync(email);
        return user;
    }

    public async Task<ApplicationUser?> GetUserByClaimsPrincipalAsync(ClaimsPrincipal User)
    {
        var user = await signInManager.UserManager.GetUserAsync(User);
        return user;
    }

    public async Task LogoutAsync()
    {
        await signInManager.SignOutAsync();
    }

    public async Task<IdentityResult> CreateNewUserAsync(ApplicationUser user, string password)
    {
        if (password == string.Empty || password == null)
        {
            var result = await signInManager.UserManager.CreateAsync(user);
            return result;
        }
        var resultWithPassword = await signInManager.UserManager.CreateAsync(user, password);
        return resultWithPassword;
    }

    public async Task<IdentityResult> AssignRoleAsync(ApplicationUser user, string role)
    {
        var result = await signInManager.UserManager.AddToRoleAsync(user, role);
        return result;
    }

    public async Task<SignInResult> SignInUserAsync(ApplicationUser user, string password, bool isPersistent)
    {
        if (password == string.Empty || password == null)
        {
            await signInManager.SignInAsync(user, isPersistent);
            return SignInResult.Success;
        }
        else
        {
            return await signInManager.PasswordSignInAsync(user, password, isPersistent, lockoutOnFailure: true);
        }
    }

    public async Task<ServiceResult<RegisterResponse>> RegisterAsync(RegisterDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return ServiceResult<RegisterResponse>.Failure("Email and Password are required.", "ValidationError");
        }

        var existingUser = await GetUserByEmailAsync(request.Email);
        if (existingUser != null)
        {
            return ServiceResult<RegisterResponse>.Failure("Email is already registered. Try to login.", "DuplicateEmail");
        }

        await using var transaction = await db.Database.BeginTransactionAsync();
        try
        {
            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                JoinedAt = DateTime.UtcNow,
                Status = UserStatus.Active,
            };

            var createResult = await CreateNewUserAsync(user, request.Password);
            if (!createResult.Succeeded)
            {
                await transaction.RollbackAsync();
                return ServiceResult<RegisterResponse>.Failure(
                    string.Join("; ", createResult.Errors.Select(e => e.Description)),
                    "UserCreationFailed"
                );
            }

            var assignRoleResult = await AssignRoleAsync(user, Roles.Candidate);
            if (!assignRoleResult.Succeeded)
            {
                await transaction.RollbackAsync();
                return ServiceResult<RegisterResponse>.Failure(
                    string.Join("; ", assignRoleResult.Errors.Select(e => e.Description)),
                    "RoleAssignmentFailed"
                );
            }

            bool profileCreated = false;
            try
            {
                profileCreated = await profileService.CreateMeSectionAsync(
                    request.FirstName, request.LastName, request.Location, user.Id
                );
            }
            catch (Exception)
            {
                // Ignored, will be handled below
            }

            if (!profileCreated)
            {
                await transaction.RollbackAsync();
                return ServiceResult<RegisterResponse>.Failure(
                    "Failed to create profile.", "ProfileCreationFailed"
                );
            }

            await transaction.CommitAsync();

            await SignInUserAsync(user, request.Password, isPersistent: false);

            return ServiceResult<RegisterResponse>.Success(
                new RegisterResponse(true, user.Id, Roles.Candidate),
                "Registration successful."
            );
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    private ServiceResult<ExternalLoginResponse> GetFailureResult(string message, string code) =>
        ServiceResult<ExternalLoginResponse>.Failure(message, code);

    private ServiceResult<ExternalLoginResponse> GetSuccessResult(string userId, string message) =>
        ServiceResult<ExternalLoginResponse>.Success(new ExternalLoginResponse(true, userId, Roles.Candidate), message);


}

