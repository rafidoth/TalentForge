using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Dto;
using server.Services.AttributeLibraryServices;

namespace server.Controllers;

[Authorize(Roles = Roles.AdminOrRecruiter)]
[ApiController]
[Route("api/attributes")]
public class AttributeController(IAttributeService attributeService) : ControllerBase
{

    [HttpGet("types-and-categories")]
    public async Task<IActionResult> GetAttributeTypesAndCategories()
    {
        var categories = await attributeService.GetCategoriesAsync();
        var types = await attributeService.GetAttributeTypesAsync();

        return Ok(new
        {
            Categories = categories,
            Types = types
        });
    }

    [HttpPost]
    public async Task<IActionResult> CreateAttribute([FromBody] CreateAttributeDto dto)
    {
        var result = await attributeService.CreateAsync(dto);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAttribute(Guid id, [FromBody] UpdateAttributeDto dto)
    {
        var result = await attributeService.UpdateAsync(id, dto);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAttribute(Guid id)
    {
        await attributeService.DeleteAsync(id);
        return NoContent();
    }

    [HttpGet]
    public async Task<IActionResult> GetAttributes([FromQuery] AttributeSearchQueryDto dto)
    {
        var results = await attributeService.SearchAsync(dto);
        return Ok(results);
    }
}
