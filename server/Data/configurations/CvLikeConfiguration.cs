using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using server.Entities;

namespace server.Data.configurations
{
    public class CvLikeConfiguration : IEntityTypeConfiguration<CvLike>
    {
        public void Configure(EntityTypeBuilder<CvLike> builder)
        {
            builder.HasKey(cl => new { cl.CvId, cl.RecruiterId });
            builder.Property(a => a.CreatedAt).HasDefaultValueSql("now()").ValueGeneratedOnAdd();
        }
    }
}
