using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using server.Entities;

namespace server.Services.PositionServices
{
    public partial class PositionAccessRuleService
    {
        public async Task<bool> HasAccessToPositionAsync(string userId, Guid positionId)
        {
            var position = await FetchPositionWithRulesAsync(positionId);
            if (position.IsPublic) return true;

            var profileAttrs = await FetchUserProfileAttributesMapAsync(userId);
            return SatisfiesAllRules(position.AccessRules, profileAttrs);
        }

        public async Task<HashSet<Guid>> GetAccessiblePositionIdsAsync(string userId)
        {
            var profileAttrs = await FetchUserProfileAttributesMapAsync(userId);
            var restrictedPositions = await FetchRestrictedPositionsWithRulesAsync();
            return EvaluateAccessiblePositions(restrictedPositions, profileAttrs);
        }

        private async Task<Position> FetchPositionWithRulesAsync(Guid positionId)
            => await db.Positions.AsNoTracking()
                 .Include(p => p.AccessRules)
                 .FirstOrDefaultAsync(p => p.Id == positionId)
                 ?? throw new Exceptions.NotFoundException(nameof(Position), positionId);

        private async Task<Dictionary<Guid, JsonElement>> FetchUserProfileAttributesMapAsync(string userId)
            => await db.ProfileAttributes.AsNoTracking()
                 .Where(pa => pa.UserId == userId)
                 .ToDictionaryAsync(pa => pa.AttributeId, pa => pa.Value);

        private async Task<List<Position>> FetchRestrictedPositionsWithRulesAsync()
            => await db.Positions.AsNoTracking()
                 .Include(p => p.AccessRules)
                 .Where(p => !p.IsPublic)
                 .ToListAsync();

        private HashSet<Guid> EvaluateAccessiblePositions(List<Position> restrictedPositions, Dictionary<Guid, JsonElement> profileAttrs)
        {
            var accessibleIds = new HashSet<Guid>();
            restrictedPositions.Where(p => SatisfiesAllRules(p.AccessRules, profileAttrs))
                               .ToList()
                               .ForEach(p => accessibleIds.Add(p.Id));
            return accessibleIds;
        }

        private bool SatisfiesAllRules(ICollection<PositionAccessRule> rules, Dictionary<Guid, JsonElement> profileAttrs)
            => rules.All(r => profileAttrs.TryGetValue(r.AttributeId, out var value) && EvaluateRule(r, value));

        private bool EvaluateRule(PositionAccessRule rule, JsonElement userValue)
        {
            try
            {
                var expected = JsonSerializer.Deserialize<JsonElement>(rule.ExpectedValue);
                return rule.Operator switch
                {
                    RuleOperator.Equals => EvaluateEquals(userValue, expected),
                    RuleOperator.NotEquals => !EvaluateEquals(userValue, expected),
                    RuleOperator.GreaterThan => EvaluateGreaterThan(userValue, expected),
                    RuleOperator.GreaterThanOrEqual => EvaluateGreaterThanOrEqual(userValue, expected),
                    RuleOperator.LessThan => !EvaluateGreaterThanOrEqual(userValue, expected),
                    RuleOperator.LessThanOrEqual => !EvaluateGreaterThan(userValue, expected),
                    RuleOperator.Contains => EvaluateContains(userValue, expected),
                    _ => false
                };
            }
            catch { return false; }
        }

        private bool EvaluateEquals(JsonElement u, JsonElement e) => u.ToString() == e.ToString();
        private bool EvaluateGreaterThan(JsonElement u, JsonElement e) => u.TryGetDouble(out var uv) && e.TryGetDouble(out var ev) && uv > ev;
        private bool EvaluateGreaterThanOrEqual(JsonElement u, JsonElement e) => u.TryGetDouble(out var uv) && e.TryGetDouble(out var ev) && uv >= ev;
        private bool EvaluateContains(JsonElement u, JsonElement e) => u.ValueKind == JsonValueKind.Array ? u.EnumerateArray().Any(x => x.ToString() == e.ToString()) : u.ToString().Contains(e.ToString());
    }
}
