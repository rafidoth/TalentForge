using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dto;
using server.Entities;
using server.Exceptions;
using server.Services.UserServices;
using server.Utils;

namespace server.Services.PositionServices
{
    public class PositionService(ApplicationDbContext db) : IPositionService
    {
        public async Task<PagedResponse<PositionDto>> GetAllPositionsAsync(int pageNumber = 1, int pageSize = 10)
        {
            var (totalPages, totalRecords) = await GetTotalPages(pageNumber, pageSize);
            var positions = await GetPaginatedPositionList(pageSize, pageNumber);
            return BuildPagedResponseAsync(positions, pageNumber, pageSize, totalRecords, totalPages);
        }

        private async Task<(int, int)> GetTotalPages(int pageNumber, int pageSize)
        {
            (pageNumber, pageSize) = SafeParsePageNumberAndPageSize(pageNumber, pageSize);
            var totalRecords = await db.Positions.AsNoTracking().CountAsync();
            var totalpages = (int)Math.Ceiling((double)totalRecords / pageSize);
            if (totalpages > 0) pageNumber = Math.Min(pageNumber, totalpages);
            return (totalpages, totalRecords);
        }

        private (int, int) SafeParsePageNumberAndPageSize(int pageNumber, int pageSize)
        {
            pageNumber = Math.Max(1, pageNumber);
            pageSize = Math.Clamp(pageSize, 1, 50);
            return (pageNumber, pageSize);
        }

        private async Task<List<Position>> GetPaginatedPositionList(int pageSize, int pageNumber)
        {
            return await db.Positions
                .Include(p => p.PositionAttributes)
                .Include(p => p.AccessRules)
                .Include(p => p.TechnologyTags)
                .OrderByDescending(p => p.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }
        private PagedResponse<PositionDto> BuildPagedResponseAsync(
            List<Position> positions,
            int pageNumber, int pageSize,
            int totalRecords, int totalPages
        )
        {
            return new PagedResponse<PositionDto>
            {
                Data = positions.Select(MapToDto).ToList(),
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = totalPages,
                TotalRecords = totalRecords
            };
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
                Id = Guid.NewGuid(),
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
            position.Title = dto.Title;
            position.ShortDescription = dto.ShortDescription;
            position.MaxProjects = dto.MaxProjects;
            return position;
        }

        private async Task UpdateExternalPositionData(Position position, UpdatePositionDto dto)
        {
            await UpdatePositionAttributes(position, dto);
            await UpdatePositionAccessRules(position, dto);
            await UpdatePositionTechnologyTags(position, dto);
        }

        private async Task UpdatePositionTechnologyTags(Position position, UpdatePositionDto dto)
        {
            db.PositionTechnologyTags.RemoveRange(position.TechnologyTags);
            position.TechnologyTags = dto.TechnologyTags.Select(tt => new PositionTechnologyTag
            {
                PositionId = position.Id,
                TagId = tt.TagId
            }).ToList();
        }

        private async Task UpdatePositionAccessRules(Position position, UpdatePositionDto dto)
        {
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
            db.PositionAttributes.RemoveRange(position.PositionAttributes);
            position.PositionAttributes = dto.Attributes.Select(a => new PositionAttribute
            {
                Id = Guid.NewGuid(),
                PositionId = position.Id,
                AttributeId = a.AttributeId,
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
            Attributes = MapToAttributeDto(position),
            AccessRules = MapToAccessRuleDto(position),
            TechnologyTags = MapToTechnologyTagDto(position)
        };

        private static List<PositionAttributeDto> MapToAttributeDto(Position position)
        {
            return position.PositionAttributes?.Select(pa => new PositionAttributeDto
            {
                AttributeId = pa.AttributeId,
                Order = pa.Order
            }).ToList() ?? new();
        }

        private static List<PositionAccessRuleDto> MapToAccessRuleDto(Position position)
        {
            return position.AccessRules?.Select(ar => new PositionAccessRuleDto
            {
                AttributeId = ar.AttributeId,
                Operator = ar.Operator,
                ExpectedValue = ar.ExpectedValue
            }).ToList() ?? new();
        }

        private static List<PositionTechnologyTagDto> MapToTechnologyTagDto(Position position)
        {
            return position.TechnologyTags?.Select(tt => new PositionTechnologyTagDto
            {
                TagId = tt.TagId
            }).ToList() ?? new();
        }


    }
}