using server.Dto;
using server.Utils;

namespace server.Services.PositionServices
{
    public interface IPositionService
    {
        Task<List<LatestPositionDto>> GetLatestPositionsAsync();
        Task<List<PopularPositionDto>> GetPopularPositionsAsync(int limit = 5);
        Task<PagedResponse<PositionDto>> GetAllPositionsAsync(int pageNumber, int pageSize);
        Task<PagedResponse<PositionDto>> GetCandidatePositionsAsync(string userId, int pageNumber, int pageSize);
        Task<PositionDto> CreatePositionAsync(CreatePositionDto dto);
        Task<PositionDto> DuplicatePositionAsync(Guid id);
        Task<PositionDto> UpdatePositionAsync(Guid id, UpdatePositionDto dto);
        Task<bool> DeletePositionAsync(Guid id);
        Task<PositionDto> GetPositionByIdAsync(Guid id);
        Task ExistsAsync(Guid positionId);
    }
}