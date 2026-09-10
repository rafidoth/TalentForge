using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Dto;
using server.Services.AttributeLibraryServices;
using Microsoft.AspNetCore.Identity;
using server.Entities;
using server.Services.CloudinaryServices;

namespace server.Controllers;


[Authorize]
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

    [Authorize(Roles = Roles.AdminOrRecruiter)]
    [HttpPost]
    public async Task<IActionResult> CreateAttribute([FromBody] CreateAttributeDto dto)
    {
        var result = await attributeService.CreateAsync(dto);
        return Ok(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = Roles.AdminOrRecruiter)]
    public async Task<IActionResult> UpdateAttribute(Guid id, [FromBody] UpdateAttributeDto dto)
    {
        var result = await attributeService.UpdateAsync(id, dto);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = Roles.AdminOrRecruiter)]
    public async Task<IActionResult> DeleteAttribute(Guid id)
    {
        await attributeService.DeleteAsync(id);
        return NoContent();
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAttributeById(Guid id)
    {
        var result = await attributeService.GetAttributeDtoByIdAsync(id);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAttributes([FromQuery] AttributeSearchQueryDto dto)
    {
        var results = await attributeService.SearchAsync(dto);
        return Ok(results);
    }

    [HttpGet("image/upload")]
    public IActionResult GetImageUploadSignature(
        [FromQuery] string attributeName,
        [FromQuery] string? folder = "talentforge_attributes",
        [FromServices] ICloudinaryService cloudinaryService = null!,
        [FromServices] UserManager<ApplicationUser> userManager = null!
    )
    {
        var user = userManager.GetUserAsync(User).Result;
        var userId = user!.Id;
        var sanitizedAttr = System.Text.RegularExpressions.Regex.Replace(attributeName ?? "attr", @"[^a-zA-Z0-9_-]", "_");
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var publicId = $"{userId}_{sanitizedAttr}_{timestamp}";

        var signatureData = cloudinaryService.GenerateSignature(publicId, folder ?? "talentforge_attributes");
        return Ok(signatureData);
    }
}
