using server.Dto;
using server.Entities;
using server.Exceptions;

namespace server.Services.PositionServices
{
    public partial class PositionService
    {
        public async Task<PositionDto> CreatePositionAsync(CreatePositionDto dto)
        {
            ValidateTitle(dto.Title);
            return await CreateAsync(dto.Title);
        }

        private void ValidateTitle(string title)
        {
            if (string.IsNullOrWhiteSpace(title) || title.Length > 255)
                throw new ValidationException("Title", "Title is required and must be <= 255 characters.");
        }

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
