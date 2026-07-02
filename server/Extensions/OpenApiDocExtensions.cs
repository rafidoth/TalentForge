using Scalar.AspNetCore;

namespace server.Extensions
{
    public static class OpenApiDocExtensions
    {
        public static IServiceCollection AddApiDoc(this IServiceCollection services)
        {
            services.AddOpenApi();
            return services;
        }

        public static WebApplication ConfigureApiDoc(this WebApplication app)
        {

            app.MapOpenApi();
            app.MapScalarApiReference();
            return app;
        }
    }
}