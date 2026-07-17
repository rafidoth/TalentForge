using server.Dto;
using server.Entities;

namespace server.Services.PositionServices
{
    public partial class PositionService
    {
        public async Task<PositionDto> DuplicatePositionAsync(Guid id)
            => MapToDto(await DuplicatePositionWithNewTitle(await GetPositionWithDetailsById(id)));

        private async Task<Position> DuplicatePositionWithNewTitle(Position existingPosition)
        {
            var newPosition = BuildPosition($"{existingPosition.Title} (Copy)", existingPosition.ShortDescription, existingPosition.IsPublic, existingPosition.MaxProjects);
            CopyExternalData(existingPosition, newPosition);
            db.Positions.Add(newPosition);
            await db.SaveChangesAsync();
            return newPosition;
        }

        private void CopyExternalData(Position source, Position target)
        {
            CopyAttributes(source, target);
            CopyAccessRules(source, target);
            CopyTechnologyTags(source, target);
        }

        private void CopyAttributes(Position source, Position target)
            => target.PositionAttributes = source.PositionAttributes.Select(pa => new PositionAttribute { PositionId = target.Id, AttributeId = pa.AttributeId, Order = pa.Order }).ToList();

        private void CopyAccessRules(Position source, Position target)
            => target.AccessRules = source.AccessRules.Select(ar => new PositionAccessRule { Id = Guid.NewGuid(), PositionId = target.Id, AttributeId = ar.AttributeId, Operator = ar.Operator, ExpectedValue = ar.ExpectedValue }).ToList();

        private void CopyTechnologyTags(Position source, Position target)
            => target.TechnologyTags = source.TechnologyTags.Select(tt => new PositionTechnologyTag { PositionId = target.Id, TagId = tt.TagId }).ToList();
    }
}
