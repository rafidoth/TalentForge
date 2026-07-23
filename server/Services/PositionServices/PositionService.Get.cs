using Microsoft.EntityFrameworkCore;
using server.Dto;
using server.Exceptions;
using server.Utils;

namespace server.Services.PositionServices
{
    public partial class PositionService
    {
        public async Task<List<LatestPositionDto>> GetLatestPositionsAsync()
            => await db.Positions.AsNoTracking().OrderByDescending(p => p.UpdatedAt).Take(7)
                .Select(p => new LatestPositionDto { Id = p.Id, Title = p.Title, UpdatedAt = p.UpdatedAt, IsPublic = p.IsPublic }).ToListAsync();

        public async Task<List<PopularPositionDto>> GetPopularPositionsAsync(int limit = 5)
        {
            return await db.Positions
                .AsNoTracking()
                .Select(p => new PopularPositionDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    ShortDescription = p.ShortDescription,
                    IsPublic = p.IsPublic,
                    SubmittedCvCount = p.Cvs.Count(c => c.IsPublished),
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
                })
                .OrderByDescending(p => p.SubmittedCvCount)
                .Take(limit)
                .ToListAsync();
        }

        public async Task<PagedResponse<PositionDto>> GetAllPositionsAsync(int pageNumber = 1, int pageSize = 10)
            => await PagedResponse.CreateAsync(db.Positions.AsNoTracking().Select(MapToDtoExpr()), pageNumber, pageSize, 10);

        public async Task<PagedResponse<PositionDto>> GetCandidatePositionsAsync(string userId, int pageNumber = 1, int pageSize = 10)
        {
            var accessibleIds = await accessRuleService.GetAccessiblePositionIdsAsync(userId);
            var query = db.Positions
                          .AsNoTracking()
                          .Where(p => p.IsPublic || accessibleIds.Contains(p.Id));

            return await PagedResponse.CreateAsync(query.Select(MapToDtoExpr()), pageNumber, pageSize, 10);
        }

        public async Task<PositionDto> GetPositionByIdAsync(Guid id)
            => MapToDto(await GetPositionById(id));

        public async Task ExistsAsync(Guid positionId)
        {
            if (!await db.Positions.AnyAsync(p => p.Id == positionId))
                throw new NotFoundException("Position", positionId);
        }
    }
}
