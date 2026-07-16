using server.Dto;

namespace server.Services.TagsServices;

public interface ITagsService
{
    Task<TagDto> CreateAsync(CreateTagDto dto);
    Task<List<TagDto>> SearchAsync(TagSearchQueryDto dto);
}
