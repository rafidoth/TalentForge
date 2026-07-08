using System.ComponentModel.DataAnnotations;

namespace server.Entities
{
    public class Position
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        public string? ShortDescription { get; set; }
        public bool IsPublic { get; set; }
        public int MaxProjects { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<PositionAttribute> PositionAttributes { get; set; } = new List<PositionAttribute>();
        public ICollection<PositionAccessRule> AccessRules { get; set; } = new List<PositionAccessRule>();
        public ICollection<PositionTechnologyTag> TechnologyTags { get; set; } = new List<PositionTechnologyTag>();
        public ICollection<Cv> Cvs { get; set; } = new List<Cv>();
        public ICollection<PositionDiscussionPost> DiscussionPosts { get; set; } = new List<PositionDiscussionPost>();
    }
}