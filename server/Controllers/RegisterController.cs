using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Dto;

namespace server.Controllers;

[ApiController]
[Route("api/users")]
public class RegisterController(UserManager<IdentityUser> userManager) : ControllerBase
{

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Email and Password are required." });
        }

        var result = userManager.FindByEmailAsync(request.Email);
        if (result.Result != null)
        {
            return BadRequest(new { message = "Email is already registered. Try to login." });
        }

        var user = new IdentityUser
        {
            UserName = request.Email,
            Email = request.Email
        };

        var createResult = await userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
        {
            return BadRequest(createResult.Errors);
        }

        await userManager.AddToRoleAsync(user, Roles.Candidate);

        return Ok(new { message = "User registered successfully." });
    }
}

