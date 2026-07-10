using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using server.Dto;
using server.Utils;

namespace server.Services.PositionServices
{
    public interface IPositionAttributeService
    {
        Task<PositionAttributeDto> CreateAsync(Guid positionId, CreatePositionAttributeDto dto);
        Task<PagedResponse<PositionAttributeDto>> GetAllAsync(Guid positionId, int pageNumber = 1, int pageSize = 10);
        Task DeleteAsync(Guid positionId, Guid attributeId);
    }
}