using Microsoft.EntityFrameworkCore;
using server.Dto;
using server.Entities;
using server.Utils;

namespace server.Services.CvServices;

public partial class CvService
{
    public async Task<CvDetailDto> GetCvByIdAsync(Guid cvId)
    {
        var cv = await FindCvOrThrowAsync(cvId);
        var attrs = await GetCandidateProfileAttributesAsync(cv.CandidateId);
        var projects = await GetCvProjectsAsync(cv.ChosenProjectIds);
        return MapToCvDetailDto(cv, ExtractCandidateName(attrs), MapAttributes(attrs, cv.Position), projects);
    }

    public async Task<PagedResponse<CvListDto>> GetCvsByCandidateIdAsync(string candidateId, int page, int size)
    {
        var q = db.Cvs
                  .Include(c => c.Position)
                  .Where(c => c.CandidateId == candidateId)
                  .OrderByDescending(c => c.CreatedAt);
        var pageResponse = await PagedResponse.CreateAsync(q, page, size);
        var name = ExtractCandidateName(await GetCandidateProfileAttributesAsync(candidateId));
        return MapPagedResponse(pageResponse, c => MapToCvListDto(c, name));
    }

    public async Task<PagedResponse<CvListDto>> GetCvsByPositionIdAsync(Guid positionId, int page, int size)
    {
        var q = db.Cvs.Include(c => c.Position).Where(c => c.PositionId == positionId).OrderByDescending(c => c.CreatedAt);
        return await MapCvListWithNamesAsync(await PagedResponse.CreateAsync(q, page, size));
    }

    public async Task<PagedResponse<CvListDto>> SearchCvsAsync(string query, int page, int size)
    {
        var q = db.Cvs.Include(c => c.Position).Where(c => c.Position.Title.Contains(query)).OrderByDescending(c => c.CreatedAt);
        return await MapCvListWithNamesAsync(await PagedResponse.CreateAsync(q, page, size));
    }

    private async Task<List<ProjectDto>> GetCvProjectsAsync(List<Guid> pIds)
    {
        var p = await db.Projects.Include(p => p.ProjectTechnologyTags).ThenInclude(pt => pt.Tag).Where(x => pIds.Contains(x.Id)).ToListAsync();
        return p.Select(MapProject).ToList();
    }

    private ProjectDto MapProject(Project p)
        => new() { Id = p.Id, Name = p.Name, StartDate = p.StartDate, EndDate = p.EndDate, Description = p.Description, Tags = p.ProjectTechnologyTags.Select(t => new TagDto(t.TagId, t.Tag.Name)).ToList(), Version = 0 };

    private async Task<PagedResponse<CvListDto>> MapCvListWithNamesAsync(PagedResponse<Cv> cvs)
    {
        var names = await GetCandidateNamesAsync(cvs.Data.Select(c => c.CandidateId).Distinct());
        return MapPagedResponse(cvs, c => MapToCvListDto(c, names.GetValueOrDefault(c.CandidateId, "Unknown")));
    }

    private PagedResponse<CvListDto> MapPagedResponse(PagedResponse<Cv> page, Func<Cv, CvListDto> m)
        => new() { Data = page.Data.Select(m).ToList(), PageNumber = page.PageNumber, PageSize = page.PageSize, TotalPages = page.TotalPages, TotalRecords = page.TotalRecords };

    private async Task<Dictionary<string, string>> GetCandidateNamesAsync(IEnumerable<string> cIds)
    {
        var stringIds = cIds.ToList();
        var attrs = await db.ProfileAttributes.Include(pa => pa.Attribute).Where(pa => stringIds.Contains(pa.UserId) && (pa.Attribute.Name == "First Name" || pa.Attribute.Name == "Last Name")).ToListAsync();
        return cIds.ToDictionary(id => id, id => ExtractCandidateName(attrs.Where(a => a.UserId == id).ToList()));
    }

    private List<ProfileAttributeDto> MapAttributes(List<ProfileAttribute> attrs, Position pos)
        => attrs.Where(a => IsRequiredOrMe(a, pos)).Select(MapProfileAttribute).ToList();

    private bool IsRequiredOrMe(ProfileAttribute a, Position pos)
        => a.Attribute.Category?.Name == "Me" || pos.PositionAttributes.Any(pa => pa.AttributeId == a.AttributeId);

    private ProfileAttributeDto MapProfileAttribute(ProfileAttribute a)
        => new() { Id = a.Id, AttributeId = a.AttributeId, AttributeName = a.Attribute.Name, TypeName = a.Attribute.Type.ToString(), CategoryName = a.Attribute.Category?.Name ?? "", Value = a.Value, Version = 0 };

    private CvDetailDto MapToCvDetailDto(Cv cv, string name, List<ProfileAttributeDto> attrs, List<ProjectDto> projects)
        => new() { Id = cv.Id, CandidateId = cv.CandidateId, PositionId = cv.PositionId, PositionTitle = cv.Position.Title, CandidateName = name, CreatedAt = cv.CreatedAt, LikeCount = cv.LikeCount, Attributes = attrs, Projects = projects };

    public async Task<CheckCvExistsResponseDto> CheckCvExistsAsync(string candidateId, Guid positionId)
    {
        var existingCv = await db.Cvs
            .AsNoTracking()
            .Where(cv => cv.CandidateId == candidateId && cv.PositionId == positionId)
            .Select(cv => new { cv.Id })
            .FirstOrDefaultAsync();

        return new CheckCvExistsResponseDto
        {
            Exists = existingCv != null,
            CvId = existingCv?.Id
        };
    }
}
