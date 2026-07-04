using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace server.Extensions
{
    public static class EfCoreExtensions
    {
        public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
        {
            var dataSourceBuilder = new NpgsqlDataSourceBuilder(configuration.GetConnectionString("PG"));
            dataSourceBuilder.EnableDynamicJson();
            var dataSource = dataSourceBuilder.Build();
            services.AddDbContext<ApplicationDbContext>(
                options => options.UseNpgsql(dataSource)
            );
            return services;
        }

        // public static async Task<WebApplication> SeedBuiltInAttributes(this WebApplication app)
        // {
        //     using var scope = app.Services.CreateScope();
        //     var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();

        //     var adminEmail = configuration["RootAdmin:Email"] ?? throw new ArgumentException(
        //         "Admin user email is not configured."
        //     );
        //     var adminPassword = configuration["RootAdmin:Password"] ?? throw new ArgumentException(
        //         "Admin user password is not configured."
        //     );

        //     var adminUser = await userManager.FindByEmailAsync(adminEmail);
        //     if (adminUser == null)
        //     {
        //         adminUser = new IdentityUser { UserName = adminEmail, Email = adminEmail, EmailConfirmed = true };
        //         var result = await userManager.CreateAsync(adminUser, adminPassword);
        //         if (result.Succeeded)
        //         {
        //             await userManager.AddToRoleAsync(adminUser, Roles.Admin);
        //         }
        //     }
        //     return app;
        // }
    }

}