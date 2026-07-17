using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace server.Services.PositionServices
{
    public partial class PositionAccessRuleService
    {
        public async Task<bool> DeleteRuleAsync(Guid positionId, Guid ruleId)
        {
            var position = await GetPositionOrThrowAsync(positionId);
            db.PositionAccessRules.Remove(await GetRuleOrThrowAsync(positionId, ruleId));

            var remainingRulesCount = await db.PositionAccessRules.CountAsync(r => r.PositionId == positionId && r.Id != ruleId);
            if (remainingRulesCount == 0 && !position.IsPublic)
                position.IsPublic = true;

            await db.SaveChangesAsync();
            return true;
        }
    }
}
