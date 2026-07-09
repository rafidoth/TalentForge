namespace server.Dto;


public record UserDto
{
    public string Id { get; init; } = null!;
    public string Email { get; init; } = null!;
    public string Method { get; init; } = null!;
    public string Status { get; set; } = null!;
    public string Role { get; set; } = null!;
    public DateTime JoinedAt { get; set; }
    public DateTime LastLoginAt { get; set; }
}


public record UserManagementActionDto
{
    public required List<string> UserIds { get; set; }
    public string? RoleName { get; set; }
}