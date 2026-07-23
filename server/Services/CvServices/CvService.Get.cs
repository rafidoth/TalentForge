using Microsoft.EntityFrameworkCore;
using server.Dto;
using server.Entities;
using server.Utils;
using System.Text.Json;

namespace server.Services.CvServices;

public partial class CvService
{
    public async Task<CvDetailDto> GetCvByIdAsync(Guid cvId)
    {
        var cv = await FindCvOrThrowAsync(cvId);
        var projects = await GetCvProjectsAsync(cv.ChosenProjectIds);
        var names = await GetCandidateNamesAsync(new[] { cv.CandidateId });
        var name = names.GetValueOrDefault(cv.CandidateId, "Unknown");
        return BuildCvDetailDto(cv, name, projects);
    }

    public async Task<FullCvDetailDto> GetFullCvByIdAsync(Guid cvId)
    {
        var cv = await FindCvOrThrowAsync(cvId);
        var projects = await GetCvProjectsAsync(cv.ChosenProjectIds);
        var requiredAttributes = await FetchAllRequiredAttributesAsync(cv.PositionId);
        var candidateAttributes = await FetchCandidateAttributesAsync(cv.CandidateId, requiredAttributes.Select(a => a.Id));

        return BuildFullCvDetailDto(cv, projects, requiredAttributes, candidateAttributes);
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

    private async Task<List<AppAttribute>> FetchAllRequiredAttributesAsync(Guid positionId)
    {
        var positionAttrs = await FetchPositionAttributesAsync(positionId);
        var builtinAttrs = await FetchBuiltinPersonalAttributesAsync();
        return positionAttrs.Concat(builtinAttrs).DistinctBy(a => a.Id).ToList();
    }

    private async Task<List<AppAttribute>> FetchPositionAttributesAsync(Guid positionId)
    {
        var position = await db.Positions
            .Include(p => p.PositionAttributes).ThenInclude(pa => pa.Attribute).ThenInclude(a => a.DropdownOptions)
            .FirstOrDefaultAsync(p => p.Id == positionId);
        return position?.PositionAttributes.Select(pa => pa.Attribute).ToList() ?? new List<AppAttribute>();
    }

    private async Task<List<AppAttribute>> FetchBuiltinPersonalAttributesAsync()
        => await db.Attributes
            .Include(a => a.DropdownOptions)
            .Include(a => a.Type)
            .Include(a => a.Category)
            .Where(a => a.Category!.Name == "Personal Information" && a.IsBuiltin == true)
            .ToListAsync();

    private async Task<List<ProfileAttribute>> FetchCandidateAttributesAsync(string candidateId, IEnumerable<Guid> requiredIds)
        => await db.ProfileAttributes
            .Include(pa => pa.Attribute).ThenInclude(a => a.DropdownOptions)
            .Include(pa => pa.Attribute).ThenInclude(a => a.Category)
            .Include(pa => pa.Attribute).ThenInclude(a => a.Type)
            .Where(pa => pa.UserId == candidateId && requiredIds.Contains(pa.AttributeId))
            .ToListAsync();

    private async Task<List<ProjectDto>> GetCvProjectsAsync(List<Guid> pIds)
    {
        var p = await db.Projects.Include(p => p.ProjectTechnologyTags).ThenInclude(pt => pt.Tag).Where(x => pIds.Contains(x.Id)).ToListAsync();
        return p.Select(MapProject).ToList();
    }

    private async Task<PagedResponse<CvListDto>> MapCvListWithNamesAsync(PagedResponse<Cv> cvs)
    {
        var names = await GetCandidateNamesAsync(cvs.Data.Select(c => c.CandidateId).Distinct());
        return MapPagedResponse(cvs, c => MapToCvListDto(c, names.GetValueOrDefault(c.CandidateId, "Unknown")));
    }

    private async Task<Dictionary<string, string>> GetCandidateNamesAsync(IEnumerable<string> cIds)
    {
        var stringIds = cIds.ToList();
        var attrs = await db.ProfileAttributes.Include(pa => pa.Attribute).Where(pa => stringIds.Contains(pa.UserId) && (pa.Attribute.Name == "First Name" || pa.Attribute.Name == "Last Name")).ToListAsync();
        return cIds.ToDictionary(id => id, id => ExtractCandidateName(attrs.Where(a => a.UserId == id).ToList()));
    }

    private PagedResponse<CvListDto> MapPagedResponse(PagedResponse<Cv> page, Func<Cv, CvListDto> m)
        => new() { Data = page.Data.Select(m).ToList(), PageNumber = page.PageNumber, PageSize = page.PageSize, TotalPages = page.TotalPages, TotalRecords = page.TotalRecords };

    private ProjectDto MapProject(Project p)
        => new() { Id = p.Id, Name = p.Name, StartDate = p.StartDate, EndDate = p.EndDate, Description = p.Description, Tags = p.ProjectTechnologyTags.Select(t => new TagDto(t.TagId, t.Tag.Name)).ToList(), Version = 0 };

    private ProfileAttributeDto MapProfileAttribute(ProfileAttribute a)
        => new() { Id = a.Id, AttributeId = a.AttributeId, AttributeName = a.Attribute.Name, TypeName = a.Attribute.Type?.Name ?? "", CategoryName = a.Attribute.Category?.Name ?? "", Value = a.Value, IsBuiltin = a.Attribute.IsBuiltin, DropdownOptions = a.Attribute.DropdownOptions?.Select(d => new DropdownOptionDto(d.Id, d.Label)).ToList(), Version = 0 };

    private AttributeDto MapAttributeToDto(AppAttribute a)
        => new() { Id = a.Id, Name = a.Name, TypeName = a.Type?.Name ?? "", CategoryName = a.Category?.Name ?? "", IsBuiltin = a.IsBuiltin, DropdownOptions = a.DropdownOptions?.Select(d => new DropdownOptionDto(d.Id, d.Label)).ToList() };

    private CvDetailDto BuildCvDetailDto(Cv cv, string name, List<ProjectDto> projects)
        => new() { Id = cv.Id, CandidateId = cv.CandidateId, PositionId = cv.PositionId, PositionTitle = cv.Position?.Title ?? "", CandidateName = name, CreatedAt = cv.CreatedAt, LikeCount = cv.LikeCount, IsPublished = cv.IsPublished, Projects = projects };

    private FullCvDetailDto BuildFullCvDetailDto(Cv cv, List<ProjectDto> projects, List<AppAttribute> requiredAttrs, List<ProfileAttribute> candidateAttrs)
    {
        var filledIds = candidateAttrs.Select(ca => ca.AttributeId).ToHashSet();
        return new FullCvDetailDto
        {
            Id = cv.Id,
            CandidateId = cv.CandidateId,
            PositionId = cv.PositionId,
            PositionTitle = cv.Position?.Title ?? "",
            CandidateName = ExtractCandidateName(candidateAttrs),
            CreatedAt = cv.CreatedAt,
            LikeCount = cv.LikeCount,
            IsPublished = cv.IsPublished,
            Projects = projects,
            FilledAttributes = candidateAttrs.Select(MapProfileAttribute).ToList(),
            MissingAttributes = requiredAttrs.Where(a => !filledIds.Contains(a.Id)).Select(MapAttributeToDto).ToList()
        };
    }
}
