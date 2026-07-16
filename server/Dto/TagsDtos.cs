using System.ComponentModel.DataAnnotations;

namespace server.Dto;

public record CreateTagDto(
    [Required(ErrorMessage = "Tag name is required.")]
    string Name
);

public record TagDto(Guid Id, string Name);

public record TagSearchQueryDto(
    string? Prefix = null,
    int N = 10
);
