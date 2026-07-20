using Microsoft.EntityFrameworkCore;
using server.Dto;
using server.Entities;
using server.Exceptions;

namespace server.Services.CvServices;

public partial class CvService
{
    public async Task<CreateCvResponseDto> CreateCvAsync(string candidateId, CreateCvDto dto)
    {
        var positionAttrs = await GetPositionWithAttributesAsync(dto.PositionId);
        var candidateAttrs = await GetCandidateProfileAttributesAsync(candidateId);
        return await ValidateAndCreateCvAsync(candidateId, positionAttrs, candidateAttrs);
    }

    private async Task<Position> GetPositionWithAttributesAsync(Guid positionId)
        => await db.Positions
             .Include(p => p.PositionAttributes)
                .ThenInclude(pa => pa.Attribute)
             .Include(p => p.TechnologyTags)
             .Include(p => p.AccessRules)
             .FirstOrDefaultAsync(p => p.Id == positionId)
             ?? throw new NotFoundException(nameof(Position), positionId);

    private async Task<CreateCvResponseDto> ValidateAndCreateCvAsync(string cId, Position pos, List<ProfileAttribute> pAttrs)
    {
        var missing = GetMissingAttributes(pos.PositionAttributes, pAttrs);
        return await BuildAndSaveCvAsync(cId, pos, missing);
    }

    private List<MissingAttributeDto> GetMissingAttributes(IEnumerable<PositionAttribute> posAttrs, List<ProfileAttribute> pAttrs)
        => posAttrs.Where(pa => pAttrs.All(p => p.AttributeId != pa.AttributeId))
             .Select(pa => new MissingAttributeDto { AttributeId = pa.AttributeId, Name = pa.Attribute.Name })
             .ToList();

    private async Task<CreateCvResponseDto> BuildAndSaveCvAsync(string candidateId, Position pos, List<MissingAttributeDto> missingAttributes)
    {
        var cv = new Cv
        {
            CandidateId = candidateId,
            PositionId = pos.Id,
            IsPublished = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        db.Cvs.Add(cv);
        await db.SaveChangesAsync();
        return new CreateCvResponseDto { CvId = cv.Id, MissingAttributes = missingAttributes };
    }

}
