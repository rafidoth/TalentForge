using System.ComponentModel.DataAnnotations.Schema;

namespace server.Entities
{
    public class CvLike
    {
        public Guid CvId { get; set; }

        [ForeignKey("CvId")]
        public Cv Cv { get; set; } = null!;

        public string RecruiterId { get; set; } = string.Empty;

        [ForeignKey("RecruiterId")]
        public ApplicationUser Recruiter { get; set; } = null!;

        public DateTime CreatedAt { get; set; }
    }
}
