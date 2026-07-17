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
        var candidateHasAttrs = await GetCandidateProfileAttributesAsync(candidateId);
        return await ValidateAndCreateCvAsync(candidateId, positionAttrs, candidateHasAttrs);
    }

    private async Task<Position> GetPositionWithAttributesAsync(Guid positionId)
        => await db.Positions.Include(p => p.PositionAttributes).ThenInclude(pa => pa.Attribute)
             .Include(p => p.TechnologyTags)
             .FirstOrDefaultAsync(p => p.Id == positionId) ?? throw new NotFoundException(nameof(Position), positionId);

    private async Task<CreateCvResponseDto> ValidateAndCreateCvAsync(string cId, Position pos, List<ProfileAttribute> pAttrs)
    {
        var missing = GetMissingAttributes(pos.PositionAttributes, pAttrs);
        if (missing.Any()) return new CreateCvResponseDto { Success = false, MissingAttributes = missing };
        return await BuildAndSaveCvAsync(cId, pos);
    }

    private List<MissingAttributeDto> GetMissingAttributes(IEnumerable<PositionAttribute> posAttrs, List<ProfileAttribute> pAttrs)
        => posAttrs.Where(pa => pAttrs.All(p => p.AttributeId != pa.AttributeId))
             .Select(pa => new MissingAttributeDto { AttributeId = pa.AttributeId, Name = pa.Attribute.Name })
             .ToList();

    private async Task<CreateCvResponseDto> BuildAndSaveCvAsync(string candidateId, Position pos)
    {
        var projects = await GetCandidateProjectsAsync(candidateId, pos);
        var cv = new Cv { CandidateId = candidateId, PositionId = pos.Id, ChosenProjectIds = projects, CreatedAt = DateTime.UtcNow };
        db.Cvs.Add(cv);
        await db.SaveChangesAsync();
        return new CreateCvResponseDto { Success = true, CvId = cv.Id };
    }

    private async Task<List<Guid>> GetCandidateProjectsAsync(string candidateId, Position pos)
        => await db.Projects.Include(p => p.ProjectTechnologyTags)
             .Where(p => p.UserId == candidateId)
             .OrderByDescending(p => p.ProjectTechnologyTags.Count(t => pos.TechnologyTags.Any(pt => pt.TagId == t.TagId)))
             .Take(pos.MaxProjects).Select(p => p.Id).ToListAsync();
}
