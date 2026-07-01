using Npgsql;
using Scalar.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using server.Data;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddUserSecrets<Program>();
var dataSourceBuilder = new NpgsqlDataSourceBuilder(builder.Configuration.GetConnectionString("PG"));
dataSourceBuilder.EnableDynamicJson();
var dataSource = dataSourceBuilder.Build();
builder.Services.AddDbContext<ApplicationDbContext>(
    options => options.UseNpgsql(dataSource)
    );

builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<IdentityUser>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();

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

    var adminEmail = builder.Configuration["RootAdmin:Email"];
    var adminPassword = builder.Configuration["RootAdmin:Password"];
    if (!string.IsNullOrEmpty(adminEmail) && !string.IsNullOrEmpty(adminPassword))
    {
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
        var adminUser = await userManager.FindByEmailAsync(adminEmail);

        if (adminUser == null)
        {
            adminUser = new IdentityUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(adminUser, adminPassword);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, Roles.Admin);
            }
        }
    }
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
