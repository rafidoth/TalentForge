using System.ComponentModel.DataAnnotations;
using server.Entities;

namespace server.Dto;


public record PositionDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = null!;
    public string? ShortDescription { get; init; }
    public bool IsPublic { get; init; }
    public int MaxProjects { get; init; }
    public DateTime CreatedAt { get; init; }
    public List<PositionAttributeDto> Attributes { get; init; } = new();
    public List<PositionAccessRuleDto> AccessRules { get; init; } = new();
    public List<PositionTechnologyTagDto> TechnologyTags { get; init; } = new();
}

public record PositionAttributeDto
{
    [Required(ErrorMessage = PositionConstraints.AttributeIdRequiredErrorMessage)]
    public Guid AttributeId { get; init; }
    [Required(ErrorMessage = PositionConstraints.OrderRequiredErrorMessage)]
    public int Order { get; init; }
}

public record PositionAccessRuleDto
{
    [Required(ErrorMessage = PositionConstraints.AttributeIdRequiredErrorMessage)]
    public Guid AttributeId { get; init; }
    [Required(ErrorMessage = PositionConstraints.OrderRequiredErrorMessage)]
    public RuleOperator Operator { get; init; }
    [Required(ErrorMessage = PositionConstraints.ExpectedValueRequiredErrorMessage)]
    public string ExpectedValue { get; init; } = string.Empty;
}

public record PositionTechnologyTagDto
{
    [Required(ErrorMessage = PositionConstraints.TagIdRequiredErrorMessage)]
    public Guid TagId { get; init; }
}

public record CreatePositionDto
{
    [Required(ErrorMessage = PositionConstraints.TitleRequiredErrorMessage)]
    [StringLength(PositionConstraints.TitleMaxLength, ErrorMessage = PositionConstraints.TitleMaxLengthErrorMessage)]
    public required string Title { get; init; }
}

public record UpdatePositionDto
{
    [Required(ErrorMessage = PositionConstraints.TitleRequiredErrorMessage)]
    [StringLength(PositionConstraints.TitleMaxLength, ErrorMessage = PositionConstraints.TitleMaxLengthErrorMessage)]
    public required string Title { get; init; }

    [StringLength(PositionConstraints.ShortDescriptionMaxLength, ErrorMessage = PositionConstraints.ShortDescriptionMaxLengthErrorMessage)]
    public string? ShortDescription { get; init; }

    [Required]
    [Range(PositionConstraints.MaxProjectsMin, PositionConstraints.MaxProjectsMax, ErrorMessage = PositionConstraints.MaxProjectsRangeErrorMessage)]
    public int MaxProjects { get; init; }

    public List<PositionAttributeDto> Attributes { get; init; } = new();
    public List<PositionAccessRuleDto> AccessRules { get; init; } = new();
    public List<PositionTechnologyTagDto> TechnologyTags { get; init; } = new();
}
