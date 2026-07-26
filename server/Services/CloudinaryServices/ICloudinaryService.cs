using server.Dto;

namespace server.Services.CloudinaryServices
{
    public interface ICloudinaryService
    {
        CloudinarySignatureDto GenerateSignature(string publicId, string folder = "talentforge_attributes");
        Task<bool> DeleteImageAsync(string publicId);
    }

}
