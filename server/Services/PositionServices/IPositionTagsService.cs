using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using server.Dto;

namespace server.Services.PositionServices
{
    public interface IPositionTagsService
    {
        Task<List<TagDto>> UpdateTagsOfPositionAsync(Guid positionId, CreatePositionTagDto dto);
        Task<List<TagDto>> GetTagsOfPositionAsync(Guid positionId);
    }
}
