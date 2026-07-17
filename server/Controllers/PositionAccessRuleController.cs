using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Dto;
using server.Services.PositionServices;

namespace server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/positions/{positionId:guid}/access-rules")]
    public class PositionAccessRuleController(IPositionAccessRuleService service) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> Get(Guid positionId) 
            => Ok(await service.GetRulesAsync(positionId));

        [Authorize(Roles = Roles.AdminOrRecruiter)]
        [HttpPost]
        public async Task<IActionResult> Post(Guid positionId, [FromBody] PositionAccessRuleDto dto) 
            => Ok(await service.CreateRuleAsync(positionId, dto));

        [Authorize(Roles = Roles.AdminOrRecruiter)]
        [HttpPut("{ruleId:guid}")]
        public async Task<IActionResult> Put(Guid positionId, Guid ruleId, [FromBody] PositionAccessRuleDto dto) 
            => Ok(await service.UpdateRuleAsync(positionId, ruleId, dto));

        [Authorize(Roles = Roles.AdminOrRecruiter)]
        [HttpDelete("{ruleId:guid}")]
        public async Task<IActionResult> Delete(Guid positionId, Guid ruleId)
        {
            await service.DeleteRuleAsync(positionId, ruleId);
            return NoContent();
        }
    }
}
