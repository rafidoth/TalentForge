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
