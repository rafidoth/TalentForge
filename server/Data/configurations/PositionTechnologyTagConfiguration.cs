using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using server.Entities;

namespace server.Data.configurations
{
    public class PositionTechnologyTagConfiguration : IEntityTypeConfiguration<PositionTechnologyTag>
    {
        public void Configure(EntityTypeBuilder<PositionTechnologyTag> builder)
        {
            builder.HasKey(pt => new { pt.PositionId, pt.TagId });
        }
    }
}
