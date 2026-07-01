using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SampleController : ControllerBase
{
    [Authorize(Roles = "Recruiter")]
    [HttpPost("create/recruiter")]
    public async Task<IActionResult> CreateSampleRecruiter()
    {
        await Task.Delay(1000);
        return Ok(new { message = "Sample created successfully!" });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("create/admin")]
    public async Task<IActionResult> CreateSampleAdmin()
    {
        return Ok(new { message = "Admin sample created successfully!" });
    }

    [Authorize(Roles = "Candidate")]
    [HttpPost("create/candidate")]
    public async Task<IActionResult> CreateSampleCandidate()
    {
        return Ok(new { message = "Admin sample created successfully!" });
    }
}
