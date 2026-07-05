namespace server.Dto;

public record ProfileAttributeDto(
    Guid Id,
    Guid AttributeId,
    string AttributeName,
    string TypeName,
    string CategoryName,
    string Value,
    List<DropdownOptionDto>? DropdownOptions,
    uint Version
);

public record AddProfileAttributeDto(Guid AttributeId);

// For updating the value of a profile attribute (auto-save uses this)
public record UpdateProfileAttributeValueDto(Guid ProfileAttributeId, string Value, uint Version);

public record MeSectionDto(
    List<ProfileAttributeDto> MeAttributes
);

// Update me section
public record UpdateMeSectionDto(List<UpdateProfileAttributeValueDto> Attributes);

// Create project
public record CreateProjectDto(string Name, DateOnly? StartDate, DateOnly? EndDate, string? Description, List<string>? Tags);

// Update project
public record UpdateProjectDto(string? Name, DateOnly? StartDate, DateOnly? EndDate, string? Description, List<string>? Tags, uint Version);

// Project response
public record ProjectDto(Guid Id, string Name, DateOnly? StartDate, DateOnly? EndDate, string? Description, List<string> Tags, uint Version, DateTime? CreatedAt, DateTime? UpdatedAt);

// Auto-save request - batches multiple changes
public record AutoSaveDto(List<UpdateProfileAttributeValueDto>? AttributeUpdates, List<AutoSaveProjectDto>? ProjectUpdates);

public record AutoSaveProjectDto(Guid ProjectId, string? Name, DateOnly? StartDate, DateOnly? EndDate, string? Description, List<string>? Tags, uint Version);

// Auto-save result per item
public record AutoSaveItemResult(Guid Id, bool Success, uint? NewVersion, string? Error);
public record AutoSaveResultDto(List<AutoSaveItemResult> Results);

// Full profile response
public record FullProfileDto(MeSectionDto Me, List<ProfileAttributeDto> Info, List<ProjectDto> Projects);
