using Microsoft.AspNetCore.Identity;
using server.Extensions;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddUserSecrets<Program>();

builder.Services.AddDatabase(builder.Configuration)
                .AddApplicationServices()
                .AddIdentityHandlersAndStores()
                .AddIdentityAuth(builder.Configuration)
                .AddCorsPolicy(builder.Configuration)
                .AddApiDoc();

builder.Services.AddControllers();

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.ConfigureApiDoc();

    await app.SeedRoles();
    await app.SeedAdminUser(builder.Configuration);
    await app.SeedBuiltInAttributes();

}

app.UseExceptionHandler();

app.UseHttpsRedirection();
app.ConfigureCorsPolicy().ConfigureIdentityAuth();

app.MapControllers();
app.Run();
