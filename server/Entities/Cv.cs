using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Entities
{
    public class Cv
    {
        [Key]
        public Guid Id { get; set; }

        public string CandidateId { get; set; } = string.Empty;

        [ForeignKey("CandidateId")]
        public ApplicationUser Candidate { get; set; } = null!;

        public Guid PositionId { get; set; }

        [ForeignKey("PositionId")]
        public Position Position { get; set; } = null!;

        public DateTime CreatedAt { get; set; }

        public int LikeCount { get; set; }

        public ICollection<CvLike> Likes { get; set; } = new List<CvLike>();
    }
}
