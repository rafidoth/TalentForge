using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Dto;
using server.Services.CvServices;

namespace server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/cvs")]
    public class CvController(ICvService cvService) : ControllerBase
    {
        private string GetUserIdString() => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? Guid.Empty.ToString();

        [HttpPost]
        public async Task<IActionResult> CreateCv([FromBody] CreateCvDto dto)
        {
            var result = await cvService.CreateCvAsync(GetUserIdString(), dto);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetCvById(Guid id)
            => Ok(await cvService.GetCvByIdAsync(id));

        [HttpGet("candidate/{candidateId}")]
        public async Task<IActionResult> GetCvsByCandidateId(string candidateId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
            => Ok(await cvService.GetCvsByCandidateIdAsync(candidateId, pageNumber, pageSize));

        [HttpGet("position/{positionId:guid}")]
        public async Task<IActionResult> GetCvsByPositionId(Guid positionId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
            => Ok(await cvService.GetCvsByPositionIdAsync(positionId, pageNumber, pageSize));

        [HttpGet("search")]
        public async Task<IActionResult> SearchCvs([FromQuery] string q, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
            => Ok(await cvService.SearchCvsAsync(q, pageNumber, pageSize));

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteCv(Guid id)
        {
            await cvService.DeleteCvAsync(id);
            return NoContent();
        }

        [HttpPost("{id:guid}/like")]
        public async Task<IActionResult> LikeCv(Guid id)
        {
            await cvService.LikeCvAsync(id, GetUserIdString());
            return Ok();
        }

        [HttpDelete("{id:guid}/like")]
        public async Task<IActionResult> UnlikeCv(Guid id)
        {
            await cvService.UnlikeCvAsync(id, GetUserIdString());
            return Ok();
        }
    }
}