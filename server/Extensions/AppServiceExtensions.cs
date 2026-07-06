using Microsoft.AspNetCore.Identity;
using server.Entities;
using server.Services.AttributeLibraryServices;
using server.Services.ProfileServices;
using server.Services.UserServices;
using server.Utils;

namespace server.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IAttributeService, AttributeService>();
            services.AddScoped<IProfileService, ProfileService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IUserConfirmation<ApplicationUser>, UserConfirmation>();
            return services;
        }
    }
}