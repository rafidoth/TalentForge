using server.Dto;
using server.Entities;
using server.Exceptions;

namespace server.Services.PositionServices
{
    public partial class PositionService
    {
        public async Task<PositionDto> CreatePositionAsync(CreatePositionDto dto)
            => await CreateAsync(dto.Title);

        private async Task<PositionDto> CreateAsync(string title)
        {
            var position = BuildPosition(title);
            db.Positions.Add(position);
            await db.SaveChangesAsync();
            return MapToDto(position);
        }

        private Position BuildPosition(string Title, string? ShortDescription = null, bool? IsPublic = true, int? MaxProjects = 5)
            => new() { Title = Title, ShortDescription = ShortDescription, IsPublic = IsPublic ?? true, MaxProjects = MaxProjects ?? 5, CreatedAt = DateTime.UtcNow };
    }
}
