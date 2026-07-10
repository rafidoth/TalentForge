using Microsoft.EntityFrameworkCore;
using server.Dto;
using server.Entities;
using server.Exceptions;
using server.Utils;

namespace server.Services.PositionServices
{
    public class PositionService(ApplicationDbContext db) : IPositionService
    {
        public async Task ExistsAsync(Guid positionId)
        {
            var result = await db.Positions.AnyAsync(p => p.Id == positionId);
            if (!result)
            {
                throw new NotFoundException("Position", positionId);
            }
        }
        public async Task<PagedResponse<PositionDto>> GetAllPositionsAsync(int pageNumber = 1, int pageSize = 10)
        {
            var query = db.Positions.AsNoTracking().Select(p => new PositionDto
            {
                Id = p.Id,
                Title = p.Title,
                ShortDescription = p.ShortDescription,
                IsPublic = p.IsPublic,
                MaxProjects = p.MaxProjects,
                CreatedAt = p.CreatedAt,
            });

            return await PagedResponse.CreateAsync(
                query,
                pageNumber,
                pageSize,
                maxPageSize: 10
            );
        }



        public async Task<PositionDto> CreatePositionAsync(CreatePositionDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title) || dto.Title.Length > 255)
                throw new ValidationException("Title", "Title is required and must be less than or equal to 255 characters.");
            return await CreateAsync(dto.Title);
        }

        private async Task<PositionDto> CreateAsync(string title)
        {
            var position = BuildPosition(title);
            db.Positions.Add(position);
            await db.SaveChangesAsync();
            return MapToDto(position);
        }

        private Position BuildPosition(string Title, string? ShortDescription = null, bool? IsPublic = true, int? MaxProjects = 5)
        {
            return new Position
            {
                Title = Title,
                ShortDescription = ShortDescription,
                IsPublic = IsPublic ?? true,
                MaxProjects = MaxProjects ?? 5,
                CreatedAt = DateTime.UtcNow
            };
        }

        public async Task<PositionDto> DuplicatePositionAsync(Guid id)
        {
            var existingPosition = await GetPositionById(id);
            string newTitle = $"{existingPosition.Title} (Copy)";
            Position newPosition = await DuplicatePositionWithNewTitle(existingPosition, newTitle);
            return MapToDto(newPosition);
        }

        private async Task<Position> DuplicatePositionWithNewTitle(Position existingPosition, string newTitle)
        {
            var newPosition = BuildPosition(newTitle, existingPosition.ShortDescription, existingPosition.IsPublic, existingPosition.MaxProjects);
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
        {
            target.PositionAttributes = source.PositionAttributes.Select(pa => new PositionAttribute
            {
                PositionId = target.Id,
                AttributeId = pa.AttributeId,
                Order = pa.Order
            }).ToList();
        }

        private void CopyAccessRules(Position source, Position target)
        {
            target.AccessRules = source.AccessRules.Select(ar => new PositionAccessRule
            {
                Id = Guid.NewGuid(),
                PositionId = target.Id,
                AttributeId = ar.AttributeId,
                Operator = ar.Operator,
                ExpectedValue = ar.ExpectedValue
            }).ToList();
        }

        private void CopyTechnologyTags(Position source, Position target)
        {
            target.TechnologyTags = source.TechnologyTags.Select(tt => new PositionTechnologyTag
            {
                PositionId = target.Id,
                TagId = tt.TagId
            }).ToList();
        }


        public async Task<PositionDto> UpdatePositionAsync(Guid id, UpdatePositionDto dto)
        {
            using var transaction = await db.Database.BeginTransactionAsync();
            var position = await GetPositionById(id);
            position = await UpdatePosition(position, dto);
            await transaction.CommitAsync();
            return MapToDto(position);
        }

        private async Task<Position> UpdatePosition(Position position, UpdatePositionDto dto)
        {
            position = BuildUpdatedPosition(position, dto);
            await UpdateExternalPositionData(position, dto);
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
            if (!string.IsNullOrWhiteSpace(dto.Title))
                position.Title = dto.Title;
            if (dto.ShortDescription != null)
                position.ShortDescription = dto.ShortDescription;
        }

        private void UpdateIsPublicAndMaxProjects(Position position, UpdatePositionDto dto)
        {
            if (dto.IsPublic.HasValue)
                position.IsPublic = dto.IsPublic.Value;
            if (dto.MaxProjects.HasValue)
                position.MaxProjects = dto.MaxProjects.Value;
        }

        private async Task UpdateExternalPositionData(Position position, UpdatePositionDto dto)
        {
            await UpdatePositionAttributes(position, dto);
            await UpdatePositionAccessRules(position, dto);
            await UpdatePositionTechnologyTags(position, dto);
        }

        private async Task UpdatePositionTechnologyTags(Position position, UpdatePositionDto dto)
        {
            if (dto.TechnologyTags == null) return;
            db.PositionTechnologyTags.RemoveRange(position.TechnologyTags);
            position.TechnologyTags = dto.TechnologyTags.Select(tt => new PositionTechnologyTag
            {
                PositionId = position.Id,
                TagId = tt.TagId
            }).ToList();
        }

        private async Task UpdatePositionAccessRules(Position position, UpdatePositionDto dto)
        {

            if (dto.AccessRules == null) return;
            db.PositionAccessRules.RemoveRange(position.AccessRules);
            position.AccessRules = dto.AccessRules.Select(ar => new PositionAccessRule
            {
                Id = Guid.NewGuid(),
                PositionId = position.Id,
                AttributeId = ar.AttributeId,
                Operator = ar.Operator,
                ExpectedValue = ar.ExpectedValue
            }).ToList();
        }

        private async Task UpdatePositionAttributes(Position position, UpdatePositionDto dto)
        {
            if (dto.Attributes == null) return;
            db.PositionAttributes.RemoveRange(position.PositionAttributes);
            position.PositionAttributes = dto.Attributes.Select(a => new PositionAttribute
            {
                Id = Guid.NewGuid(),
                PositionId = position.Id,
                AttributeId = a.Id,
                Order = a.Order
            }).ToList();
        }


        public async Task<bool> DeletePositionAsync(Guid id)
        {
            var position = await db.Positions.FindAsync(id) ?? throw new NotFoundException(nameof(Position), id);
            db.Positions.Remove(position);
            await db.SaveChangesAsync();
            return true;
        }

        public async Task<PositionDto> GetPositionByIdAsync(Guid id)
        {
            var position = await GetPositionById(id);
            return MapToDto(position);
        }

        private async Task<Position> GetPositionById(Guid id)
        {
            return await db.Positions
                .Include(p => p.PositionAttributes)
                .Include(p => p.AccessRules)
                .Include(p => p.TechnologyTags)
                .FirstOrDefaultAsync(p => p.Id == id) ?? throw new NotFoundException(nameof(Position), id);
        }

        private static PositionDto MapToDto(Position position) => new()
        {
            Id = position.Id,
            Title = position.Title,
            ShortDescription = position.ShortDescription,
            IsPublic = position.IsPublic,
            MaxProjects = position.MaxProjects,
            CreatedAt = position.CreatedAt,
        };
    }
}