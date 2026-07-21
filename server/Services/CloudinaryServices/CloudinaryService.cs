using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace server.Services.CloudinaryServices
{
    public class CloudinaryService : ICloudinaryService
    {
        private readonly Cloudinary _cloudinary;
        private readonly string _cloudName;
        private readonly string _apiKey;

        public CloudinaryService(IConfiguration config)
        {
            _cloudName = config["Cloudinary:CloudName"]
                ?? throw new InvalidOperationException("Cloudinary:CloudName is not configured.");
            _apiKey = config["Cloudinary:ApiKey"]
                ?? throw new InvalidOperationException("Cloudinary:ApiKey is not configured.");
            var apiSecret = config["Cloudinary:ApiSecret"]
                ?? throw new InvalidOperationException("Cloudinary:ApiSecret is not configured.");

            var account = new Account(_cloudName, _apiKey, apiSecret);
            _cloudinary = new Cloudinary(account);
        }

        public CloudinarySignatureDto GenerateSignature(string publicId, string folder = "talentforge_attributes")
        {
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();

            var parameters = new SortedDictionary<string, object>
            {
                { "timestamp", timestamp },
                { "folder", folder },
                { "public_id", publicId }
            };

            var signature = _cloudinary.Api.SignParameters(parameters);

            return new CloudinarySignatureDto
            {
                Signature = signature,
                Timestamp = timestamp,
                ApiKey = _apiKey,
                CloudName = _cloudName,
                Folder = folder,
                PublicId = publicId
            };
        }

        public async Task<bool> DeleteImageAsync(string publicId)
        {
            if (string.IsNullOrWhiteSpace(publicId)) return false;

            try
            {
                var deleteParams = new DeletionParams(publicId);
                var result = await _cloudinary.DestroyAsync(deleteParams);
                return result.Result == "ok";
            }
            catch
            {
                // Fail-safe: deletion errors should not block attribute updates
                return false;
            }
        }
    }
}
