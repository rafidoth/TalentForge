using System.ComponentModel.DataAnnotations;

namespace server.Dto;

public record CreateAttributeDto(
    [Required(ErrorMessage = "Attribute name is required.")]
    string Name,
    int TypeId,
    int CategoryId,
    string Value,
    string Description,
    List<string>? DropdownOptions = null
);


public record UpdateAttributeDto(
    string? Name,
    int? TypeId,
    int? CategoryId,
    List<string>? DropdownOptions,
    uint Version
);

public record AttributeSearchQueryDto(
    string? Prefix = null,
    int? CategoryId = null,
    string? UserId = null,
    int Page = 1,
    int PageSize = 20
);

// Response DTO for a single attribute
public record AttributeDto
{
    public Guid Id { get; init; } = Guid.Empty;
    public string Name { get; init; } = string.Empty;
    public int TypeId { get; init; }
    public string TypeName { get; init; } = string.Empty;
    public int CategoryId { get; init; }
    public string CategoryName { get; init; } = string.Empty;
    public bool IsBuiltin { get; init; }
    public List<DropdownOptionDto>? DropdownOptions { get; init; }
    public uint Version { get; init; }
};

// Response DTO for dropdown options
public record DropdownOptionDto(Guid Id, string Label);

// Response DTO for categories
public record AttributeCategoryDto(int Id, string Name);
