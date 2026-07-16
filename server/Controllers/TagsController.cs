using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Dto;
using server.Services.TagsServices;

namespace server.Controllers;

[Authorize]
[ApiController]
[Route("api/tags")]
public class TagsController(ITagsService tagsService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateTag([FromBody] CreateTagDto dto)
    {
        var result = await tagsService.CreateAsync(dto);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetTags([FromQuery] TagSearchQueryDto dto)
    {
        var results = await tagsService.SearchAsync(dto);
        return Ok(results);
    }
}
