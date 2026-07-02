using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using server.Data;

namespace server.Extensions
{
    public static class IdentityExtensions
    {
        public static IServiceCollection AddIdentityHandlersAndStores(this IServiceCollection services)
        {

            services.AddIdentityApiEndpoints<IdentityUser>()
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>();
            return services;
        }

        public static IServiceCollection AddIdentityAuth(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAuthentication()
                .AddGoogle(options =>
                {
                    options.ClientId = configuration["Authentication:Google:ClientId"] ?? throw new ArgumentException(
                        "Google ClientId is not configured."
                    );
                    options.ClientSecret = configuration["Authentication:Google:ClientSecret"] ?? throw new ArgumentException(
                        "Google ClientSecret is not configured."
                    );
                    options.SignInScheme = IdentityConstants.ExternalScheme;
                });

            services.AddAuthorization();
            return services;
        }

        public static WebApplication ConfigureIdentityAuth(this WebApplication app)
        {
            app.UseAuthentication();
            app.UseAuthorization();
            return app;
        }

        public static async Task<WebApplication> SeedRoles(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            dbContext.Database.Migrate();

            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            if (!await roleManager.RoleExistsAsync(Roles.Admin))
            {
                await roleManager.CreateAsync(new IdentityRole(Roles.Admin));
            }

            if (!await roleManager.RoleExistsAsync(Roles.Candidate))
            {
                await roleManager.CreateAsync(new IdentityRole(Roles.Candidate));
            }

            if (!await roleManager.RoleExistsAsync(Roles.Recruiter))
            {
                await roleManager.CreateAsync(new IdentityRole(Roles.Recruiter));
            }
            return app;
        }

        public static async Task<WebApplication> SeedAdminUser(this WebApplication app, IConfiguration configuration)
        {
            using var scope = app.Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();

            var adminEmail = configuration["RootAdmin:Email"] ?? throw new ArgumentException(
                "Admin user email is not configured."
            );
            var adminPassword = configuration["RootAdmin:Password"] ?? throw new ArgumentException(
                "Admin user password is not configured."
            );

            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new IdentityUser { UserName = adminEmail, Email = adminEmail, EmailConfirmed = true };
                var result = await userManager.CreateAsync(adminUser, adminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, Roles.Admin);
                }
            }
            return app;
        }
    }
}