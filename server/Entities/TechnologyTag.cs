using System.ComponentModel.DataAnnotations;

namespace server.Entities
{
    public class TechnologyTag
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public ICollection<ProjectTechnologyTag> ProjectTechnologyTags { get; set; } = new List<ProjectTechnologyTag>();
    }
}
