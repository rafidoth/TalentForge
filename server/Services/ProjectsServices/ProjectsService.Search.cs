using Microsoft.EntityFrameworkCore;
using server.Dto;
using server.Utils;

namespace server.Services.ProjectsServices;

public partial class ProjectsService
{
    public async Task<PagedResponse<ProjectDto>> SearchProjectsAsync(string userId, ProjectSearchQueryDto dto)
    {
        var query = BuildSearchQuery(userId, dto);
        var result = await PagedResponse.CreateAsync(
            query,
            dto.Page,
            dto.PageSize,
            maxPageSize: 50
        );
        return result;
    }

    private IQueryable<ProjectDto> BuildSearchQuery(string userId, ProjectSearchQueryDto dto)
    {
        var baseQuery = GetBaseProjectQuery(userId);
        var filteredQuery = AddSearchFilters(baseQuery, dto.TagIds);
        var sortedQuery = ApplySorting(filteredQuery, dto.Recent);
        return MapQueryToProjectDto(sortedQuery);
    }

    private IQueryable<Entities.Project> GetBaseProjectQuery(string userId)
    {
        return db.Projects
            .Where(p => p.UserId == userId)
            .Include(p => p.ProjectTechnologyTags).ThenInclude(pt => pt.Tag);
    }

    private IQueryable<Entities.Project> AddSearchFilters(IQueryable<Entities.Project> query, List<Guid>? tagIds)
    {
        if (tagIds != null && tagIds.Any())
        {
            query = query.Where(p => p.ProjectTechnologyTags.Any(pt => tagIds.Contains(pt.TagId)));
        }
        return query;
    }

    private IQueryable<Entities.Project> ApplySorting(IQueryable<Entities.Project> query, bool recent)
    {
        if (recent)
            return query.OrderByDescending(p => p.CreatedAt).ThenByDescending(p => p.Id);
        return query.OrderByDescending(p => p.CreatedAt);
    }

    private IQueryable<ProjectDto> MapQueryToProjectDto(IQueryable<Entities.Project> query)
    {
        return query.Select(p => new ProjectDto
        {
            Id = p.Id,
            Name = p.Name,
            StartDate = p.StartDate,
            EndDate = p.EndDate,
            Description = p.Description,
            Tags = p.ProjectTechnologyTags.Select(pt => new TagDto(pt.Tag.Id, pt.Tag.Name)).ToList(),
            Version = EF.Property<uint>(p, "Version")
        });
    }
}
