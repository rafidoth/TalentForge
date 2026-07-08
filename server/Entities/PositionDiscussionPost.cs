using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Entities
{
    public class PositionDiscussionPost
    {
        [Key]
        public Guid Id { get; set; }

        public Guid PositionId { get; set; }

        [ForeignKey("PositionId")]
        public Position Position { get; set; } = null!;

        public string AuthorId { get; set; } = string.Empty;

        [ForeignKey("AuthorId")]
        public ApplicationUser Author { get; set; } = null!;

        [Required]
        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
    }
}
