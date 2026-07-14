using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace server.Dto;

public record ProfileAttributeDto
{
    public Guid Id { get; set; }
    public Guid AttributeId { get; set; }
    public string AttributeName { get; set; } = string.Empty;
    public string TypeName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public JsonElement Value { get; set; }
    public List<DropdownOptionDto>? DropdownOptions { get; set; }
    public uint Version { get; set; }
}

public record AddProfileAttributeDto
{
    [Required]
    public Guid AttributeId { get; set; }
    [Required]
    public JsonElement Value { get; set; }
}

public record UpdateProfileAttributeValueDto
{
    [Required]
    public Guid ProfileAttributeId { get; set; }

    [Required]
    public JsonElement Value { get; set; }

    [Required]
    public uint Version { get; set; }
}

public record MeSectionDto
{
    public List<ProfileAttributeDto> MeAttributes { get; set; } = [];
}

public record UpdateMeSectionDto
{
    [Required]
    [MinLength(1, ErrorMessage = "No attributes provided for update.")]
    public List<UpdateProfileAttributeValueDto> Attributes { get; set; } = [];
}

public record CreateProjectDto
{
    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? Description { get; set; }
    public List<string>? Tags { get; set; }
}

public record UpdateProjectDto
{
    public string? Name { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? Description { get; set; }
    public List<string>? Tags { get; set; }

    [Required]
    public uint Version { get; set; }
}

public record ProjectDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? Description { get; set; }
    public List<string> Tags { get; set; } = [];
    public uint Version { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public record AutoSaveDto
{
    public List<UpdateProfileAttributeValueDto>? AttributeUpdates { get; set; }
    public List<AutoSaveProjectDto>? ProjectUpdates { get; set; }
}

public record AutoSaveProjectDto
{
    [Required]
    public Guid ProjectId { get; set; }

    public string? Name { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? Description { get; set; }
    public List<string>? Tags { get; set; }

    [Required]
    public uint Version { get; set; }
}

// Auto-save result per item
public record AutoSaveItemResult
{
    public Guid Id { get; set; }
    public bool Success { get; set; }
    public uint? NewVersion { get; set; }
    public string? Error { get; set; }
}

public record AutoSaveResultDto
{
    public List<AutoSaveItemResult> Results { get; set; } = [];
}

// Full profile response
public record FullProfileDto
{
    public MeSectionDto Me { get; set; } = null!;
    public List<ProfileAttributeDto> Info { get; set; } = [];
    public List<ProjectDto> Projects { get; set; } = [];
}
