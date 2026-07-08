using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Entities
{
    public class PositionAccessRule
    {
        [Key]
        public Guid Id { get; set; }

        public Guid PositionId { get; set; }

        [ForeignKey("PositionId")]
        public Position Position { get; set; } = null!;

        public Guid AttributeId { get; set; }

        [ForeignKey("AttributeId")]
        public AppAttribute Attribute { get; set; } = null!;

        public RuleOperator Operator { get; set; }

        [Column(TypeName = "jsonb")]
        [Required]
        public string ExpectedValue { get; set; } = string.Empty;
    }
}