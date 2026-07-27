using server.Dto;
using server.Utils;

namespace server.Services.CvServices;

public interface ICvService
{
    Task<CreateCvResponseDto> CreateCvAsync(string candidateId, CreateCvDto dto);
    Task<CvDetailDto> GetCvByIdAsync(Guid cvId);
    Task<FullCvDetailDto> GetFullCvByIdAsync(Guid cvId);
    Task<CvDetailDto> UpdateCvAsync(Guid cvId, string candidateId, UpdateCvDto dto);
    Task<List<CvListDto>> GetAllCvsByCandidateIdAsync(string candidateId);
    Task<PagedResponse<CvListDto>> GetCvsWithPosition(string candidateId, int pageNumber, int pageSize);
    Task<PagedResponse<CvListDto>> GetPublishedCvsWithPositionByCandidateId(Guid positionId, int page, int size);
    Task<PagedResponse<CvListDto>> GetCvsByPositionIdAsync(Guid positionId, int pageNumber, int pageSize);
    Task<PagedResponse<CvListDto>> SearchCvsAsync(string query, int pageNumber, int pageSize);
    Task DeleteCvAsync(Guid cvId);
    Task LikeCvAsync(Guid cvId, string recruiterId);
    Task UnlikeCvAsync(Guid cvId, string recruiterId);
    Task<CheckCvExistsResponseDto> CheckCvExistsAsync(string candidateId, Guid positionId);
}
