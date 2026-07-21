namespace server.Extensions
{
    public static class CorsExtensions
    {
        public static IServiceCollection AddCorsPolicy(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddCors(options =>
            {
                var clientUrl = configuration["ClientUrl"] ?? throw new ArgumentException(
                                        "Client URL is not configured.");
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins(clientUrl)
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });

            return services;
        }

        public static WebApplication ConfigureCorsPolicy(this WebApplication app)
        {
            app.UseCors("AllowFrontend");
            return app;
        }
    }
}