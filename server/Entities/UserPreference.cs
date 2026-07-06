using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace server.Entities
{
    public class UserPreference
    {
        [Key]
        public Guid Id { get; set; }

        public string UserId { get; set; } = string.Empty;
        [Required]
        public ApplicationUser User { get; set; } = null!;

        public string Theme { get; set; } = "light";

        public string Language { get; set; } = "en";

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
