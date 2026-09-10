using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace server.Controllers;

[AllowAnonymous]
[ApiController]
[Route("health")]
public class HealthController : Controller
{
    [HttpGet]
    public IActionResult HealthCheck(Guid id)=> Ok("Healthy");

}