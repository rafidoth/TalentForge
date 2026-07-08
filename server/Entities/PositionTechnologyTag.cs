using System.ComponentModel.DataAnnotations.Schema;

namespace server.Entities
{
    public class PositionTechnologyTag
    {
        public Guid PositionId { get; set; }

        [ForeignKey("PositionId")]
        public Position Position { get; set; } = null!;

        public Guid TagId { get; set; }

        [ForeignKey("TagId")]
        public TechnologyTag Tag { get; set; } = null!;
    }
}
