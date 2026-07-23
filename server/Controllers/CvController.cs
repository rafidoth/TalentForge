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
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetCvById(Guid id)
            => Ok(await cvService.GetCvByIdAsync(id));

        [HttpGet("{id:guid}/full")]
        public async Task<IActionResult> GetFullCvById(Guid id)
            => Ok(await cvService.GetFullCvByIdAsync(id));

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateCv(Guid id, [FromBody] UpdateCvDto dto)
        {
            var result = await cvService.UpdateCvAsync(id, GetUserIdString(), dto);
            return Ok(result);
        }

        [HttpGet("exists/{positionId:guid}")]
        public async Task<IActionResult> CheckCvExists(Guid positionId)
        {
            var result = await cvService.CheckCvExistsAsync(GetUserIdString(), positionId);
            return Ok(result);
        }

        [HttpGet("candidate")]
        public async Task<IActionResult> GetCvsByCandidateId([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await cvService.GetCvsByCandidateIdAsync(GetUserIdString(), pageNumber, pageSize);
            return Ok(result);
        }

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