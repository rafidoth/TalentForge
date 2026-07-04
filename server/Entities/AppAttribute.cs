using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Entities
{
    public class AppAttribute
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Column(TypeName = "jsonb")]
        [Required]
        public string Value { get; set; } = string.Empty;

        public Guid? TypeId { get; set; }

        [ForeignKey("TypeId")]
        public AttributeType? Type { get; set; }

        public Guid? CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public AttributeCategory? Category { get; set; }

        public bool IsBuiltin { get; set; }

        public DateTime? CreatedAt { get; set; }

        public ICollection<AttributeDropdownOption> DropdownOptions { get; set; } = new List<AttributeDropdownOption>();

        public ICollection<ProfileAttribute> ProfileAttributes { get; set; } = new List<ProfileAttribute>();
    }
}