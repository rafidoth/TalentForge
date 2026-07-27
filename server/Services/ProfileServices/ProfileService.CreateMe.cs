using System.Text.Json;
using server.Data;
using server.Entities;

namespace server.Services.ProfileServices
{
    public partial class ProfileService
    {

        public async Task<bool> CreateMeSectionAsync(
            string userId,
            JsonElement FName,
            JsonElement LName,
            JsonElement Location,
            JsonElement? imageUrl
        )
        {
            var dicebear_url = cfg.GetValue<string>("DiceBear:profile_image");
            if (string.IsNullOrEmpty(dicebear_url))
            {
                throw new Exception("DiceBear profile image URL is not configured.");
            }

            var imgUrl = imageUrl ?? JsonDocument.Parse($"\"{dicebear_url}{userId.Substring(0, 4)}\"").RootElement;
            var profileAttributes = await BuildMeProfileAttributesAsync(
                userId, FName, LName, Location, imgUrl
            );

            await db.ProfileAttributes.AddRangeAsync(profileAttributes);
            await db.SaveChangesAsync();
            return true;
        }

        private async Task<List<ProfileAttribute>> BuildMeProfileAttributesAsync(
            string userId,
            JsonElement FName,
            JsonElement LName,
            JsonElement Location,
            JsonElement imgUrl
        )
        {
            var fna = await attrs.GetAttributeByNameAsync(BuiltInAttributes.FirstName);
            var lna = await attrs.GetAttributeByNameAsync(BuiltInAttributes.LastName);
            var loc = await attrs.GetAttributeByNameAsync(BuiltInAttributes.Address);
            var pia = await attrs.GetAttributeByNameAsync(BuiltInAttributes.ProfilePhoto);

            if (fna == null || lna == null || loc == null || pia == null)
            {
                throw new Exception("One or more required attributes are missing.");
            }


            return
            [
                BuildProfileAttribute(FName, userId, fna),
                BuildProfileAttribute(LName, userId, lna),
                BuildProfileAttribute(Location, userId, loc),
                BuildProfileAttribute(imgUrl, userId, pia)
            ];
        }
    }
}