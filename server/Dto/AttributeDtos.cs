namespace server.Dto;

public record CreateAttributeDto(
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

public record AttributeSearchQuery(string? Prefix = null, int? CategoryId = null, string? UserId = null, int Page = 1, int PageSize = 20);

// Response DTO for a single attribute
public record AttributeDto(Guid Id, string Name, int TypeId, string TypeName, int CategoryId, string CategoryName, bool IsBuiltin, List<DropdownOptionDto> DropdownOptions, uint Version);

// Response DTO for dropdown options
public record DropdownOptionDto(Guid Id, string Label);

// Response DTO for categories
public record AttributeCategoryDto(int Id, string Name);
