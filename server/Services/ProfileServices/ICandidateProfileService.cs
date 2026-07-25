using server.Dto;

namespace server.Services.ProfileServices;

public interface ICandidateProfileService
{
    Task<CandidateFullProfileDto> GetCandidateFullProfileAsync(string candidateId);
}
