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
}

public record PositionAttributeDto
{
    public Guid Id { get; init; }
    public AttributeDto Attribute { get; init; } = null!;
    public int Order { get; init; }
    public uint Version { get; init; }
}

public record CreatePositionAttributeDto
{
    [Required(ErrorMessage = PositionConstraints.AttributeIdRequiredErrorMessage)]
    public Guid AttributeId { get; init; }
}

public record CreatePositionAttributeResponseDto : CreatePositionAttributeDto
{
    public Guid Id { get; init; }
}

public record PositionAccessRuleDto
{
    public Guid? Id { get; init; }
    [Required(ErrorMessage = PositionConstraints.AttributeIdRequiredErrorMessage)]
    public Guid AttributeId { get; init; }
    public string? AttributeName { get; init; }
    public string? AttributeTypeName { get; init; }
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
    [StringLength(PositionConstraints.TitleMaxLength, ErrorMessage = PositionConstraints.TitleMaxLengthErrorMessage)]
    public required string? Title { get; init; }

    [StringLength(PositionConstraints.ShortDescriptionMaxLength, ErrorMessage = PositionConstraints.ShortDescriptionMaxLengthErrorMessage)]
    public string? ShortDescription { get; init; }
    public bool? IsPublic { get; init; }

    [Range(PositionConstraints.MaxProjectsMin, PositionConstraints.MaxProjectsMax, ErrorMessage = PositionConstraints.MaxProjectsRangeErrorMessage)]
    public int? MaxProjects { get; init; }
}

public record CreatePositionTagDto
{
    [Required]
    public List<Guid> TagIds { get; init; } = new();
}

public record LatestPositionDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = null!;
    public DateTime UpdatedAt { get; init; }
    public bool IsPublic { get; init; }
}
