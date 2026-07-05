using server.Services.AttributeLibraryServices;
using server.Services.ProfileServices;
using server.Services.UserServices;

namespace server.Extensions
{
    public static class ApplicationServiceExtensions
    {

        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IAttributeService, AttributeService>();
            services.AddScoped<IProfileService, ProfileService>();
            return services;
        }
    }
}