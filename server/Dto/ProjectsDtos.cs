using System.ComponentModel.DataAnnotations;

namespace server.Dto;

public record CreateProjectDto
{
    [Required(ErrorMessage = "Project name is required.")]
    [MaxLength(255, ErrorMessage = "Project name cannot exceed 255 characters.")]
    public string Name { get; set; } = string.Empty;

    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? Description { get; set; }
    public List<Guid>? Tags { get; set; }
}

public record UpdateProjectDto
{
    public string? Name { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? Description { get; set; }
    public List<Guid>? Tags { get; set; }

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
    public List<TagDto> Tags { get; set; } = [];
    public uint Version { get; set; }
}