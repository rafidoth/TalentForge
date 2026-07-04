using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using server.Entities;

namespace server.Data.Configurations
{
    public class TechnologyTagConfiguration : IEntityTypeConfiguration<TechnologyTag>
    {
        public void Configure(EntityTypeBuilder<TechnologyTag> builder)
        {
            builder.HasIndex(t => t.Name).IsUnique();
        }
    }
}
