using System.Text.Json;
using server.Entities;
using server.Data;
using server.Services.AttributeLibraryServices;
using server.Services.CloudinaryServices;

namespace server.Services.ProfileServices
{
    public partial class ProfileService(
        ApplicationDbContext db,
        IAttributeService attrs,
        IConfiguration cfg,
        ICloudinaryService cloudinaryService
        ) : IProfileService
    {
        private ProfileAttribute BuildProfileAttribute(JsonElement value, string userId, AppAttribute attr)
        {
            return new ProfileAttribute
            {
                UserId = userId,
                AttributeId = attr.Id,
                Value = value,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };
        }

        private string? ExtractPublicIdFromCloudinaryUrl(string url)
        {
            if (string.IsNullOrEmpty(url) || !url.Contains("res.cloudinary.com")) return null;
            try
            {
                var uri = new Uri(url);
                var segments = uri.AbsolutePath.Split('/');
                // url: /v1_1/cloudname/image/upload/v12345/folder/public_id.ext
                // The structure usually has /upload/[version]/folder/public_id
                // A simpler way: everything after /upload/ (excluding version if any, or just regex it)
                // Let's just find "upload/" and take everything after it (minus extension)
                var uploadIndex = Array.IndexOf(segments, "upload");
                if (uploadIndex >= 0 && uploadIndex < segments.Length - 1)
                {
                    var afterUpload = segments.Skip(uploadIndex + 1).ToList();
                    if (afterUpload.Count > 0 && afterUpload[0].StartsWith("v") && afterUpload[0].Length > 1 && char.IsDigit(afterUpload[0][1]))
                    {
                        afterUpload = afterUpload.Skip(1).ToList(); // skip version
                    }
                    var path = string.Join("/", afterUpload);
                    var lastDot = path.LastIndexOf('.');
                    if (lastDot >= 0)
                    {
                        path = path.Substring(0, lastDot);
                    }
                    return Uri.UnescapeDataString(path);
                }
            }
            catch { }
            return null;
        }

        private void CleanupOldCloudinaryImage(ProfileAttribute pa, JsonElement newValue)
        {
            if (pa.Attribute?.Type?.Name == AttributeTypes.Image && pa.Value.ValueKind == JsonValueKind.String)
            {
                var oldUrl = pa.Value.GetString();
                var newUrl = newValue.ValueKind == JsonValueKind.String ? newValue.GetString() : null;

                if (!string.IsNullOrEmpty(oldUrl) && oldUrl != newUrl && oldUrl.Contains("res.cloudinary.com"))
                {
                    var publicId = ExtractPublicIdFromCloudinaryUrl(oldUrl);
                    if (!string.IsNullOrEmpty(publicId))
                    {
                        _ = cloudinaryService.DeleteImageAsync(publicId);
                    }
                }
            }
        }
    }
}
