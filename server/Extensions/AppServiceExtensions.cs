using server.Services.AttributeLibraryService;
using server.Services.UserServices;

namespace server.Extensions
{
    public static class ApplicationServiceExtensions
    {

        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IAttributeService, AttributeService>();
            return services;
        }
    }
}