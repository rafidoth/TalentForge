using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using server.Entities;

namespace server.Data.configurations
{
    public class PositionAccessRuleConfiguration : IEntityTypeConfiguration<PositionAccessRule>
    {
        public void Configure(EntityTypeBuilder<PositionAccessRule> builder)
        {
            builder.Property(r => r.Operator).HasConversion<string>();
        }
    }
}
