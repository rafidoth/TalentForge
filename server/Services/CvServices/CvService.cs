using Microsoft.EntityFrameworkCore;
using server.Dto;
using server.Entities;
using server.Exceptions;

using server.Services.PositionServices;

namespace server.Services.CvServices;

public partial class CvService(ApplicationDbContext db, IPositionAccessRuleService accessRuleService) : ICvService
{
    private async Task<Cv> FindCvOrThrowAsync(Guid cvId)
        => await db.Cvs.Include(c => c.Position)
             .FirstOrDefaultAsync(c => c.Id == cvId)
             ?? throw new NotFoundException(nameof(Cv), cvId);

    private string ExtractCandidateName(List<ProfileAttribute> attrs)
        => FormatName(ExtractAttr(attrs, "First Name"), ExtractAttr(attrs, "Last Name"));

    private string ExtractAttr(List<ProfileAttribute> a, string n)
        => a.FirstOrDefault(x => x.Attribute.Name == n)?
        .Value.GetString() ?? "";

    private string FormatName(string f, string l)
        => string.IsNullOrWhiteSpace(f) ? l : $"{f} {l}".Trim();

    private CvListDto MapToCvListDto(Cv cv, string candidateName)
        => new()
        {
            Id = cv.Id,
            CandidateId = cv.CandidateId,
            PositionId = cv.PositionId,
            PositionTitle = cv.Position.Title,
            CandidateName = candidateName,
            IsPublished = cv.IsPublished,
            CreatedAt = cv.CreatedAt,
            LikeCount = cv.LikeCount
        };

    private async Task<List<ProfileAttribute>> GetCandidateProfileAttributesAsync(string candidateId)
        => await db.ProfileAttributes
                   .Include(pa => pa.Attribute)
                   .Where(pa => pa.UserId == candidateId)
                   .ToListAsync();
}
