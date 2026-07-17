using Microsoft.EntityFrameworkCore;
using server.Dto;
using server.Entities;
using server.Exceptions;

namespace server.Services.TagsServices;

public class TagsService(ApplicationDbContext db) : ITagsService
{
    public async Task<TagDto> CreateAsync(CreateTagDto dto)
    {
        await EnsureNotDuplicateAsync(dto.Name);
        var tag = BuildTechnologyTagEntity(dto);
        db.TechnologyTags.Add(tag);
        await db.SaveChangesAsync();
        return MapToDto(tag);
    }

    public async Task<List<TagDto>> SearchAsync(TagSearchQueryDto dto)
    {
        var query = ApplySearchFilters(db.TechnologyTags.AsQueryable(), dto);
        var n = Math.Clamp(dto.N, 1, 50);
        return await ExecuteSearchAsync(query, n);
    }

    private static async Task<List<TagDto>> ExecuteSearchAsync(IQueryable<TechnologyTag> query, int n)
    {
        return await query
            .OrderBy(t => t.Name)
            .Take(n)
            .Select(t => new TagDto(t.Id, t.Name))
            .ToListAsync();
    }

    private static IQueryable<TechnologyTag> ApplySearchFilters(IQueryable<TechnologyTag> query, TagSearchQueryDto dto)
    {
        if (!string.IsNullOrWhiteSpace(dto.Prefix))
        {
            var searchTerm = dto.Prefix.ToLower();
            query = query.Where(t => t.Name.ToLower().Contains(searchTerm));
        }

        return query;
    }

    private async Task EnsureNotDuplicateAsync(string name)
    {
        var exists = await db.TechnologyTags.AnyAsync(t => t.Name == name.Trim());
        if (exists)
            throw new ConflictException($"A tag with the name '{name}' already exists.");
    }

    private static TagDto MapToDto(TechnologyTag tag)
    {
        return new TagDto(tag.Id, tag.Name);
    }

    private TechnologyTag BuildTechnologyTagEntity(CreateTagDto dto)
    {
        return new TechnologyTag
        {
            Id = Guid.NewGuid(),
            Name = dto.Name.Trim()
        };

    }
}