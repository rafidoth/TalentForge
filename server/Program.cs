using Microsoft.AspNetCore.Identity;
using server.Extensions;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddUserSecrets<Program>();

builder.Services.AddDatabase(builder.Configuration)
                .AddApplicationServices()
                .AddIdentityHandlersAndStores()
                .AddIdentityAuth(builder.Configuration)
                .AddCorsPolicy()
                .AddApiDoc();

builder.Services.AddControllers();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.ConfigureApiDoc();

    await app.SeedRoles();
    await app.SeedAdminUser(builder.Configuration);
    await app.SeedBuiltInAttributes();

}

app.UseHttpsRedirection();
app.ConfigureCorsPolicy().ConfigureIdentityAuth();

app.MapControllers();
app.Run();
