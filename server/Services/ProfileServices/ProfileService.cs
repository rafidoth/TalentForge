using System.Text.Json;
using server.Entities;
using server.Services.AttributeLibraryServices;

namespace server.Services.ProfileServices
{
    public partial class ProfileService(
        ApplicationDbContext db,
        IAttributeService attrs,
        IConfiguration cfg
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

    }
}
