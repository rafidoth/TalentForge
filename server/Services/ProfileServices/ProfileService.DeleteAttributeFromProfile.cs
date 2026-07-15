using Microsoft.EntityFrameworkCore;
using server.Entities;
using server.Exceptions;

namespace server.Services.ProfileServices
{
    public partial class ProfileService
    {
        public async Task<bool> DeleteAttributeFromProfileAsync(string userId, Guid profileAttributeId)
        {
            var profileAttribute = await db.ProfileAttributes
                .FirstOrDefaultAsync(pa => pa.Id == profileAttributeId && pa.UserId == userId)
                ?? throw new NotFoundException(nameof(ProfileAttribute), profileAttributeId.ToString());
            db.ProfileAttributes.Remove(profileAttribute);
            await db.SaveChangesAsync();
            return true;
        }
    }
}
