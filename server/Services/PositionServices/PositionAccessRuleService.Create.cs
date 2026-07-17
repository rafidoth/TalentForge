using server.Dto;
using server.Entities;
using server.Exceptions;

namespace server.Services.PositionServices
{
    public partial class PositionAccessRuleService
    {
        public async Task<PositionAccessRuleDto> CreateRuleAsync(Guid positionId, PositionAccessRuleDto dto)
        {
            var position = await GetPositionOrThrowAsync(positionId);
            await ValidateRuleOrThrowAsync(dto.AttributeId, dto.Operator);

            var rule = BuildRule(positionId, dto);
            db.PositionAccessRules.Add(rule);

            if (position.IsPublic)
                position.IsPublic = false;

            await db.SaveChangesAsync();

            return MapToDto(rule);
        }



        private PositionAccessRule BuildRule(Guid positionId, PositionAccessRuleDto dto)
            => new()
            {
                Id = Guid.NewGuid(),
                PositionId = positionId,
                AttributeId = dto.AttributeId,
                Operator = dto.Operator,
                ExpectedValue = dto.ExpectedValue
            };
    }
}
