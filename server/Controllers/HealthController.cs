using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace server.Controllers;
[AllowAnonymous]
[ApiController]
[Route("health")]
public class HealthController(ApplicationDbContext dbContext) : Controller
{
    private readonly ApplicationDbContext _dbContext = dbContext;

    [HttpGet]
    public async Task<IActionResult> HealthCheck()
    {
        try
        {
            var canConnect = await _dbContext.Database.CanConnectAsync();

            if (!canConnect)
            {
                return StatusCode(503, "Database unreachable");
            }

            return Ok("Ok");
        }
        catch (Exception ex)
        {
            return StatusCode(503, $"Database check failed: {ex.Message}");
        }
    }
}
