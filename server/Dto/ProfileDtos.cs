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
    public bool? IsBuiltin { get; set; }
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

public record CandidatePositionAttributesDto
{
    public List<ProfileAttributeDto> FilledAttributes { get; set; } = [];
    public List<AttributeDto> MissingAttributes { get; set; } = [];
}

public record InfoSectionDto
{
    public string Email { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public DateTime JoinedAt { get; init; }
}

public record CandidateFullProfileDto
{
    public string CandidateId { get; init; } = string.Empty;
    public InfoSectionDto InfoSection { get; init; } = new();
    public MeSectionDto MeSection { get; init; } = new();
    public List<ProfileAttributeDto> Attributes { get; init; } = new();
    public List<ProjectDto> Projects { get; init; } = new();
    public List<CvListDto> Cvs { get; init; } = new();
}
