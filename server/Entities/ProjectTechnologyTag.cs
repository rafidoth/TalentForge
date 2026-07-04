using System.ComponentModel.DataAnnotations.Schema;

namespace server.Entities
{
    public class ProjectTechnologyTag
    {
        public Guid ProjectId { get; set; }

        [ForeignKey("ProjectId")]
        public Project Project { get; set; } = null!;

        public Guid TagId { get; set; }

        [ForeignKey("TagId")]
        public TechnologyTag Tag { get; set; } = null!;
    }
}
