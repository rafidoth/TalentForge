namespace server.Dto;

public record CloudinarySignatureDto
{
    public string Signature { get; init; } = string.Empty;
    public string Timestamp { get; init; } = string.Empty;
    public string ApiKey { get; init; } = string.Empty;
    public string CloudName { get; init; } = string.Empty;
    public string Folder { get; init; } = string.Empty;
    public string PublicId { get; init; } = string.Empty;
}