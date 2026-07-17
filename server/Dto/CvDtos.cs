using System;
using System.Collections.Generic;

namespace server.Dto;

public record CreateCvDto
{
    public Guid PositionId { get; init; }
}

public record MissingAttributeDto
{
    public Guid AttributeId { get; init; }
    public string Name { get; init; } = string.Empty;
}

public record CreateCvResponseDto
{
    public bool Success { get; init; }
    public Guid? CvId { get; init; }
    public List<MissingAttributeDto> MissingAttributes { get; init; } = new();
}

public record CvListDto
{
    public Guid Id { get; init; }
    public string CandidateId { get; init; } = string.Empty;
    public Guid PositionId { get; init; }
    public string PositionTitle { get; init; } = string.Empty;
    public string CandidateName { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
    public int LikeCount { get; init; }
}

public record CvDetailDto : CvListDto
{
    public List<ProfileAttributeDto> Attributes { get; init; } = new();
    public List<ProjectDto> Projects { get; init; } = new();
}
