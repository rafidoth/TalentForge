using System.ComponentModel.DataAnnotations;

namespace server.Entities
{
    public class AttributeCategory
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public ICollection<AppAttribute> Attributes { get; set; } = new List<AppAttribute>();
    }
}
