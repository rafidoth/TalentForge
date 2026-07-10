using server.Dto;
using server.Services.UserServices;
using server.Utils;

namespace server.Services.PositionServices
{
    public interface IPositionService
    {
        Task<PagedResponse<PositionDto>> GetAllPositionsAsync(int pageNumber, int pageSize);
        Task<PositionDto> CreatePositionAsync(CreatePositionDto dto);
        Task<PositionDto> DuplicatePositionAsync(Guid id);
        Task<PositionDto> UpdatePositionAsync(Guid id, UpdatePositionDto dto);
        Task<bool> DeletePositionAsync(Guid id);
        Task<PositionDto> GetPositionByIdAsync(Guid id);
        Task ExistsAsync(Guid positionId);
    }
}