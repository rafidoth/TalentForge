using server.Dto;
using server.Entities;

namespace server.Services.PositionServices
{
    public partial class PositionService
    {
        public async Task<PositionDto> UpdatePositionAsync(Guid id, UpdatePositionDto dto)
            => MapToDto(await UpdatePosition(await GetPositionById(id), dto));

        private async Task<Position> UpdatePosition(Position position, UpdatePositionDto dto)
        {
            position = BuildUpdatedPosition(position, dto);
            position.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return position;
        }

        private Position BuildUpdatedPosition(Position position, UpdatePositionDto dto)
        {
            UpdateTitleAndDescription(position, dto);
            UpdateIsPublicAndMaxProjects(position, dto);
            return position;
        }

        private void UpdateTitleAndDescription(Position position, UpdatePositionDto dto)
        {
            if (!string.IsNullOrWhiteSpace(dto.Title)) position.Title = dto.Title;
            if (dto.ShortDescription != null) position.ShortDescription = dto.ShortDescription;
        }

        private void UpdateIsPublicAndMaxProjects(Position position, UpdatePositionDto dto)
        {
            if (dto.IsPublic.HasValue) position.IsPublic = dto.IsPublic.Value;
            if (dto.MaxProjects.HasValue) position.MaxProjects = dto.MaxProjects.Value;
        }
    }
}
