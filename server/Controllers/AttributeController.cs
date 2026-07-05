using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Dto;
using server.Services.AttributeLibraryServices;

namespace server.Controllers;

[ApiController]
[Route("api/attributes")]
public class AttributeController(IAttributeService attributeService) : ControllerBase
{

    [Authorize(Roles = $"{Roles.Admin}, {Roles.Recruiter}")]
    [HttpGet("types-and-categories")]
    public async Task<IActionResult> GetAttributeTypesAndCategories()
    {
        var categoriesResult = await attributeService.GetCategoriesAsync();
        var typesResult = await attributeService.GetAttributeTypesAsync();

        if (!categoriesResult.IsSuccess || !typesResult.IsSuccess)
        {
            return BadRequest(new
            {
                message = categoriesResult.Message ?? typesResult.Message ?? "Failed to retrieve attribute types and categories."
            });
        }

        return Ok(new
        {
            Categories = categoriesResult.Data,
            Types = typesResult.Data
        });
    }
    [Authorize(Roles = $"{Roles.Admin}, {Roles.Recruiter}")]
    [HttpPost]
    public async Task<IActionResult> CreateAttribute([FromBody] CreateAttributeDto dto)
    {
        var result = await attributeService.CreateAsync(dto.Name, dto.TypeId, dto.CategoryId, dto.Description);

        if (!result.IsSuccess)
        {
            if (result.ErrorCode == "DUPLICATE_NAME")
            {
                return Conflict(new { message = result.Message });
            }
            return BadRequest(new { message = result.Message ?? "Failed to create attribute." });
        }

        return Ok(result.Data);
    }

    [Authorize(Roles = $"{Roles.Admin}, {Roles.Recruiter}")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAttribute(Guid id, [FromBody] UpdateAttributeDto dto)
    {
        var result = await attributeService.UpdateAsync(id, dto);

        if (!result.IsSuccess)
        {
            if (result.ErrorCode == "NOT_FOUND")
            {
                return NotFound(new { message = result.Message });
            }
            if (result.ErrorCode == "DUPLICATE_NAME")
            {
                return Conflict(new { message = result.Message });
            }
            return BadRequest(new { message = result.Message ?? "Failed to update attribute." });
        }

        return Ok(result.Data);
    }

    [Authorize(Roles = $"{Roles.Admin}, {Roles.Recruiter}")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAttribute(Guid id)
    {
        var result = await attributeService.DeleteAsync(id);

        if (!result.IsSuccess)
        {
            if (result.ErrorCode == "NOT_FOUND")
            {
                return NotFound(new { message = result.Message });
            }
            return BadRequest(new { message = result.Message ?? "Failed to delete attribute." });
        }

        return NoContent();
    }
}
