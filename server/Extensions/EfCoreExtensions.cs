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
    }
}