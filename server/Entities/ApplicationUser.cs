using Microsoft.AspNetCore.Identity;

namespace server.Entities
{
    public class ApplicationUser : IdentityUser
    {

        public string Status { get; set; } = "Active";
        public DateTime JoinedAt { get; set; }
        public DateTime LastLoginAt { get; set; }
    }
}