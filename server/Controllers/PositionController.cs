using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        IPositionAttributeService positionAttributeService
    ) : ControllerBase
    {
        [HttpGet("candidate")]
        public async Task<IActionResult> GetCandidatePositions([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            return Ok();
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


    }
}