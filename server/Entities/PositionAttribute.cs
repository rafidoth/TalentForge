using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Entities
{
    public class PositionAttribute
    {
        [Key]
        public Guid Id { get; set; }

        public Guid PositionId { get; set; }

        [ForeignKey("PositionId")]
        public Position Position { get; set; } = null!;

        public Guid AttributeId { get; set; }

        [ForeignKey("AttributeId")]
        public AppAttribute Attribute { get; set; } = null!;

        public int Order { get; set; }
    }
}