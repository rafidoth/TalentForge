using System;
using System.Threading.Tasks;
using server.Dto;
using server.Entities;
using server.Exceptions;

namespace server.Services.CvServices;

public partial class CvService
{
    public async Task<CvDetailDto> UpdateCvAsync(Guid cvId, string candidateId, UpdateCvDto dto)
    {
        var cv = await FindCvOrThrowAsync(cvId);
        EnsureCandidateOwnsCv(cv, candidateId);
        ApplyCvUpdates(cv, dto);
        
        await db.SaveChangesAsync();
        return await GetCvByIdAsync(cvId);
    }

    private void EnsureCandidateOwnsCv(Cv cv, string candidateId)
    {
        if (cv.CandidateId != candidateId)
        {
            throw new UnauthorizedAccessException("You can only edit your own CV.");
        }
    }

    private void ApplyCvUpdates(Cv cv, UpdateCvDto dto)
    {
        cv.ChosenProjectIds = dto.ChosenProjectIds ?? new();
        cv.IsPublished = dto.IsPublished;
        cv.UpdatedAt = DateTime.UtcNow;
    }
}
