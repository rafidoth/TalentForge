using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dto;
using server.Entities;
using server.Exceptions;

namespace server.Services.PositionServices
{
    public partial class PositionAccessRuleService
    {
        private async Task ValidateRuleOrThrowAsync(Guid attributeId, RuleOperator op)
        {
            var attr = await db.Attributes
                .Include(a => a.Type)
                .FirstOrDefaultAsync(a => a.Id == attributeId)
                ?? throw new NotFoundException("Attribute", attributeId);
            if (!IsValidOperator(attr.Type?.Name, op))
                throw new BadRequestException($"Unsupported operator {op} for attribute type {attr.Type?.Name}");
        }

        private static bool IsValidOperator(string? type, RuleOperator op) => type switch
        {
            AttributeTypes.String => op is RuleOperator.Equals or
                                           RuleOperator.NotEquals or
                                           RuleOperator.Contains,
            AttributeTypes.Numeric => op is
                                    RuleOperator.Equals or
                                    RuleOperator.NotEquals or
                                    RuleOperator.GreaterThan or
                                    RuleOperator.GreaterThanOrEqual or
                                    RuleOperator.LessThan or
                                    RuleOperator.LessThanOrEqual,
            AttributeTypes.Boolean => op is RuleOperator.Equals,
            _ => false
        };
    }
}
