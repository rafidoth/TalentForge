using server.Dto;

namespace server.Services.PositionServices
{
    public partial class PositionAccessRuleService
    {
        public async Task<PositionAccessRuleDto> UpdateRuleAsync(
            Guid positionId,
            Guid ruleId,
            PositionAccessRuleDto dto
        )
        {
            var rule = await GetRuleOrThrowAsync(positionId, ruleId);
            await ValidateRuleOrThrowAsync(rule.AttributeId, dto.Operator);
            rule.Operator = dto.Operator;
            rule.ExpectedValue = dto.ExpectedValue;
            await db.SaveChangesAsync();
            return MapToDto(rule);
        }
    }
}
