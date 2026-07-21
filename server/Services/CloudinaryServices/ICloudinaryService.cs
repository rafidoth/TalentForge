namespace server.Services.CloudinaryServices
{
    public interface ICloudinaryService
    {
        CloudinarySignatureDto GenerateSignature(string publicId, string folder = "talentforge_attributes");
        Task<bool> DeleteImageAsync(string publicId);
    }

    public record CloudinarySignatureDto
    {
        public string Signature { get; init; } = string.Empty;
        public string Timestamp { get; init; } = string.Empty;
        public string ApiKey { get; init; } = string.Empty;
        public string CloudName { get; init; } = string.Empty;
        public string Folder { get; init; } = string.Empty;
        public string PublicId { get; init; } = string.Empty;
    }
}
