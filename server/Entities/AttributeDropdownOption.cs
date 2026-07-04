using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Entities
{
    public class AttributeDropdownOption
    {
        [Key]
        public Guid Id { get; set; }

        public Guid AttributeId { get; set; }

        [ForeignKey("AttributeId")]
        public AppAttribute Attribute { get; set; } = null!;

        [Required]
        public string Label { get; set; } = string.Empty;
    }
}
