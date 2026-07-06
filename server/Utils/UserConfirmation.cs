using Microsoft.AspNetCore.Identity;
using server.Data;
using server.Entities;

namespace server.Utils
{
    public class UserConfirmation : IUserConfirmation<ApplicationUser>
    {
        public Task<bool> IsConfirmedAsync(UserManager<ApplicationUser> manager, ApplicationUser user)
        {
            if (user.Status == UserStatus.Blocked)
            {
                return Task.FromResult(false);
            }
            return Task.FromResult(true);
        }
    }
}