using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace server.Entities
{
    public class ProfileAttribute
    {
        [Key]
        public Guid Id { get; set; }

        public string UserId { get; set; } = string.Empty;

        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; } = null!;

        public Guid AttributeId { get; set; }

        [ForeignKey("AttributeId")]
        public AppAttribute Attribute { get; set; } = null!;

        [Column(TypeName = "jsonb")]
        [Required]
        public string Value { get; set; } = string.Empty;

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
