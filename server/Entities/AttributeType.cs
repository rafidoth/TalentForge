using System.ComponentModel.DataAnnotations;

namespace server.Entities
{
    public class AttributeType
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public ICollection<AppAttribute> Attributes { get; set; } = new List<AppAttribute>();
    }
}
