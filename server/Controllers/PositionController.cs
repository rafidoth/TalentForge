using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using server.Data;
using server.Dto;
using server.Services.PositionServices;

namespace server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/positions")]
    public class PositionController(
        IPositionService positionService,
        IPositionAttributeService positionAttributeService,
        IPositionTagsService positionTagsService
    ) : ControllerBase
    {

        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestPositions()
        {
            var result = await positionService.GetLatestPositionsAsync();
            return Ok(result);
        }

        [Authorize(Roles = Roles.AdminOrCandidate)]
        [HttpGet("candidate")]
        public async Task<IActionResult> GetCandidatePositions([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var userId = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();
            return Ok(await positionService.GetCandidatePositionsAsync(userId, pageNumber, pageSize));
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetPositionById(Guid id)
        {
            var result = await positionService.GetPositionByIdAsync(id);
            return Ok(result);
        }

        [HttpGet("{id:guid}/attributes")]
        public async Task<IActionResult> GetPositionAttributes(Guid id, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await positionAttributeService.GetAllAsync(id, pageNumber, pageSize);
            return Ok(result);
        }

        [Authorize(Roles = Roles.AdminOrRecruiter)]
        [HttpGet]
        public async Task<IActionResult> GetAllPositions([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await positionService.GetAllPositionsAsync(pageNumber, pageSize);
            return Ok(result);
        }

        [Authorize(Roles = Roles.AdminOrRecruiter)]
        [HttpPost]
        public async Task<IActionResult> CreatePosition([FromBody] CreatePositionDto dto)
        {
            var result = await positionService.CreatePositionAsync(dto);
            return Ok(result);
        }

        [Authorize(Roles = Roles.AdminOrRecruiter)]
        [HttpPost("{id:guid}/duplicate")]
        public async Task<IActionResult> DuplicatePosition(Guid id)
        {
            var result = await positionService.DuplicatePositionAsync(id);
            return Ok(result);
        }

        [Authorize(Roles = Roles.AdminOrRecruiter)]
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdatePosition(Guid id, [FromBody] UpdatePositionDto dto)
        {
            var result = await positionService.UpdatePositionAsync(id, dto);
            return Ok(result);
        }

        [Authorize(Roles = Roles.AdminOrRecruiter)]
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeletePosition(Guid id)
        {
            await positionService.DeletePositionAsync(id);
            return NoContent();
        }

        [Authorize(Roles = Roles.AdminOrRecruiter)]
        [HttpPost("{id:guid}/attributes")]
        public async Task<IActionResult> AddAttribute(Guid id, [FromBody] CreatePositionAttributeDto dto)
        {
            var result = await positionAttributeService.CreateAsync(id, dto);
            return Ok(result);
        }

        [Authorize(Roles = Roles.AdminOrRecruiter)]
        [HttpDelete("{id:guid}/attributes/{attributeId:guid}")]
        public async Task<IActionResult> RemoveAttribute(Guid id, Guid attributeId)
        {
            await positionAttributeService.DeleteAsync(id, attributeId);
            return NoContent();
        }


        [Authorize(Roles = Roles.AdminOrRecruiter)]
        [HttpPost("{id:guid}/tags")]
        public async Task<IActionResult> UpdateTagsOfPosition(Guid id, [FromBody] CreatePositionTagDto dto)
        {
            var result = await positionTagsService.UpdateTagsOfPositionAsync(id, dto);
            return Ok(result);
        }

        [Authorize(Roles = Roles.AdminOrRecruiter)]
        [HttpGet("{id:guid}/tags")]
        public async Task<IActionResult> GetTagsOfPosition(Guid id)
        {
            var result = await positionTagsService.GetTagsOfPositionAsync(id);
            return Ok(result);
        }



    }
}