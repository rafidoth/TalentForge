using Microsoft.EntityFrameworkCore;
using server.Dto;

namespace server.Services.PositionServices
{
    public partial class PositionAccessRuleService
    {
        public async Task<List<PositionAccessRuleDto>> GetRulesAsync(Guid positionId)
        {
            await GetPositionOrThrowAsync(positionId);
            return await db.PositionAccessRules.AsNoTracking().Include(r => r.Attribute).ThenInclude(a => a.Type!).Where(r => r.PositionId == positionId).Select(r => MapToDto(r)).ToListAsync();
        }
    }
}
