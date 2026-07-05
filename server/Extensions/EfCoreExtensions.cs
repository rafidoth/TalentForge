using Microsoft.EntityFrameworkCore;
using Npgsql;
using server.Services.AttributeLibraryServices;

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

        public static async Task<WebApplication> SeedBuiltInAttributes(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var attrService = scope.ServiceProvider.GetRequiredService<IAttributeService>();

            if (!await db.Attributes.AnyAsync(a => a.IsBuiltin))
            {
                var builtInAttributes = new server.Data.BuiltInAttributes(attrService);
                var attributes = await builtInAttributes.GetAsync();

                db.Attributes.AddRange(attributes);
                await db.SaveChangesAsync();
            }

            return app;
        }
    }

}