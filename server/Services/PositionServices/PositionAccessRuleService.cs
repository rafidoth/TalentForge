using Microsoft.EntityFrameworkCore;
using server.Dto;
using server.Entities;
using server.Exceptions;

namespace server.Services.PositionServices
{
    public partial class PositionAccessRuleService(ApplicationDbContext db) : IPositionAccessRuleService
    {
        private async Task<Position> GetPositionOrThrowAsync(
            Guid positionId
        ) => await db
            .Positions
            .FindAsync(positionId)
            ?? throw new NotFoundException(nameof(Position), positionId);

        private async Task<PositionAccessRule> GetRuleOrThrowAsync(Guid positionId, Guid ruleId)
            => await db
            .PositionAccessRules
            .FirstOrDefaultAsync(r => r.PositionId == positionId && r.Id == ruleId)
            ?? throw new NotFoundException(nameof(PositionAccessRule), ruleId);

        private static PositionAccessRuleDto MapToDto(PositionAccessRule rule) => new()
        {
            Id = rule.Id,
            AttributeId = rule.AttributeId,
            AttributeName = rule.Attribute?.Name,
            AttributeTypeName = rule.Attribute?.Type?.Name,
            Operator = rule.Operator,
            ExpectedValue = rule.ExpectedValue
        };
    }
}
