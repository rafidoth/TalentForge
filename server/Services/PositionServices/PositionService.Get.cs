using Microsoft.EntityFrameworkCore;
using server.Dto;
using server.Exceptions;
using server.Utils;

namespace server.Services.PositionServices
{
    public partial class PositionService
    {
        public async Task<PagedResponse<PositionDto>> GetAllPositionsAsync(int pageNumber = 1, int pageSize = 10)
            => await PagedResponse.CreateAsync(db.Positions.AsNoTracking().Select(MapToDtoExpr()), pageNumber, pageSize, 10);

        public async Task<PositionDto> GetPositionByIdAsync(Guid id)
            => MapToDto(await GetPositionById(id));

        public async Task ExistsAsync(Guid positionId)
        {
            if (!await db.Positions.AnyAsync(p => p.Id == positionId))
                throw new NotFoundException("Position", positionId);
        }
    }
}
