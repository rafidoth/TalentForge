using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using server.Entities;

namespace server.Data.configurations
{
    public class PositionAttributeConfiguration : IEntityTypeConfiguration<PositionAttribute>
    {
        public void Configure(EntityTypeBuilder<PositionAttribute> builder)
        {
            builder.HasIndex(pa => new { pa.PositionId, pa.AttributeId }).IsUnique();
        }
    }
}
