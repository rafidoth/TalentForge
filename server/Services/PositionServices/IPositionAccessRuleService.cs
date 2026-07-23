using server.Dto;

namespace server.Services.PositionServices
{
    public interface IPositionAccessRuleService
    {
        Task<List<PositionAccessRuleDto>> GetRulesAsync(Guid positionId);
        Task<PositionAccessRuleDto> CreateRuleAsync(Guid positionId, PositionAccessRuleDto dto);
        Task<PositionAccessRuleDto> UpdateRuleAsync(Guid positionId, Guid ruleId, PositionAccessRuleDto dto);
        Task<bool> DeleteRuleAsync(Guid positionId, Guid ruleId);
        Task<HashSet<Guid>> GetAccessiblePositionIdsAsync(string userId);
        Task<bool> HasAccessToPositionAsync(string userId, Guid positionId);
    }
}
