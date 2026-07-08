using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using server.Entities;

namespace server.Data.configurations
{
    public class PositionDiscussionPostConfiguration : IEntityTypeConfiguration<PositionDiscussionPost>
    {
        public void Configure(EntityTypeBuilder<PositionDiscussionPost> builder)
        {
            builder.Property(a => a.CreatedAt).HasDefaultValueSql("now()").ValueGeneratedOnAdd();
        }
    }
}
