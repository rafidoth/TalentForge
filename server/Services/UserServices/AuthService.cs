using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dto;
using server.Entities;
using server.Exceptions;
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

    public async Task<ExternalLoginResponse> ExternalLoginSignInAsync(string loginProvider, string providerKey, bool isPersistent)
    {
        var result = await SignInUserByExternalLogin(loginProvider, providerKey);
        string? userId = GetUserIdByExternalLoginAsync(loginProvider, providerKey);
        if (!result.Succeeded || string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedException("External login failed.");
        }

        return new ExternalLoginResponse(result.Succeeded, userId ?? string.Empty, Roles.Candidate);
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

    public async Task<ExternalLoginResponse> CreateExternalUserAsync(ExternalLoginInfo info)
    {
        foreach (var claim in info.Principal.Claims)
        {
            Console.WriteLine($"{claim.Type} = {claim.Value}");
        }
        var email = info.Principal.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(email))
            throw new BadRequestException("Email not received from external provider.");
        var existingUser = await GetUserByEmailAsync(email);
        if (existingUser != null)
            return await LinkExistingExternalUserAsync(existingUser, info);
        return await CreateAndSignInNewExternalUserAsync(email, info);
    }


    private async Task<ExternalLoginResponse> LinkExistingExternalUserAsync(ApplicationUser user, ExternalLoginInfo info)
    {
        var loginResult = await signInManager.UserManager.AddLoginAsync(user, info);
        if (loginResult.Succeeded)
        {
            await signInManager.UserManager.UpdateAsync(user);
            return new ExternalLoginResponse(true, user.Id, Roles.Candidate);
        }
        throw new BadRequestException("Failed to add external login.");
    }

    private async Task<ExternalLoginResponse> CreateAndSignInNewExternalUserAsync(string email, ExternalLoginInfo info)
    {
        var user = new ApplicationUser { UserName = email, Email = email, EmailConfirmed = true };
        var result = await CreateNewUserAsync(user, string.Empty);
        if (result.Succeeded)
        {
            var (firstName, lastName, imageUrl) = ExtractInfoFromProvider(info, info.LoginProvider);
            await profileService.CreateMeSectionAsync(
                       user.Id,
                       JsonSerializer.SerializeToElement(firstName),
                       JsonSerializer.SerializeToElement(lastName),
                       JsonSerializer.SerializeToElement("Unknown"),
                       JsonSerializer.SerializeToElement(imageUrl)
                   );

            return await AssignRoleAndSignInAsync(user, info);
        }
        throw new BadRequestException("Failed to create user: " + string.Join("; ", result.Errors.Select(e => e.Description)));
    }

    private (string firstName, string lastName, string imageUrl) ExtractInfoFromProvider(ExternalLoginInfo info, string provider)
    {
        if (provider == "Google")
        {
            var firstName = info.Principal.FindFirstValue(ClaimTypes.GivenName) ?? string.Empty;
            var lastName = info.Principal.FindFirstValue(ClaimTypes.Surname) ?? string.Empty;
            var imageUrl = info.Principal.FindFirstValue("urn:google:picture") ?? string.Empty;

            return (firstName, lastName, imageUrl);
        }

        return (string.Empty, string.Empty, string.Empty);
    }

    private async Task<ExternalLoginResponse> AssignRoleAndSignInAsync(ApplicationUser user, ExternalLoginInfo info)
    {
        var result = await AssignRoleAsync(user, Roles.Candidate);
        if (result.Succeeded)
        {
            return await AddLoginAndSignInAsync(user, info);
        }
        throw new BadRequestException("Failed to assign role to user: " + string.Join("; ", result.Errors.Select(e => e.Description)));
    }

    private async Task<ExternalLoginResponse> AddLoginAndSignInAsync(ApplicationUser user, ExternalLoginInfo info)
    {
        var result = await signInManager.UserManager.AddLoginAsync(user, info);

        if (result.Succeeded)
        {
            await SignInUserAsync(user, string.Empty, isPersistent: true);
            return new ExternalLoginResponse(true, user.Id, Roles.Candidate);
        }
        throw new BadRequestException("Failed to add login to user.");
    }


    public async Task<LoginResponse> LoginAsync(LoginDto loginDto)
    {
        var user = await GetUserByEmailAsync(loginDto.Email);
        if (user == null)
        {
            throw new UnauthorizedException("Invalid login attempt.");
        }

        var signInResult = await SignInUserAsync(user, loginDto.Password, isPersistent: false);
        if (signInResult.Succeeded)
        {
            user.LastLoginAt = DateTime.UtcNow;
            await signInManager.UserManager.UpdateAsync(user);

            var role = await GetUserRoleAsync(user);
            return new LoginResponse(true, user.Id, role);
        }
        throw new UnauthorizedException("Invalid login attempt.");
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

    public async Task<ApplicationUser?> GetUserByIdAsync(string userId)
    {
        var user = await signInManager.UserManager.FindByIdAsync(userId);
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

    public async Task<RegisterResponse> RegisterAsync(RegisterDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            throw new server.Exceptions.ValidationException("Email", "Email and Password are required.");
        }

        var existingUser = await GetUserByEmailAsync(request.Email);
        if (existingUser != null)
        {
            throw new ConflictException("Email is already registered. Try to login.");
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
                throw new BadRequestException(string.Join("; ", createResult.Errors.Select(e => e.Description)));
            }

            var assignRoleResult = await AssignRoleAsync(user, Roles.Candidate);
            if (!assignRoleResult.Succeeded)
            {
                await transaction.RollbackAsync();
                throw new BadRequestException(string.Join("; ", assignRoleResult.Errors.Select(e => e.Description)));
            }

            bool profileCreated = false;
            try
            {
                profileCreated = await profileService.CreateMeSectionAsync(
                    user.Id, request.FirstName, request.LastName, request.Location, null
                );
            }
            catch (Exception)
            {
                // Ignored, will be handled below
            }

            if (!profileCreated)
            {
                await transaction.RollbackAsync();
                throw new BadRequestException("Failed to create profile.");
            }

            await transaction.CommitAsync();

            await SignInUserAsync(user, request.Password, isPersistent: false);

            return new RegisterResponse(true, user.Id, Roles.Candidate);
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}

