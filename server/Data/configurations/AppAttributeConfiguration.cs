using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using server.Entities;

namespace server.Data.Configurations
{
    public class AttributeConfiguration : IEntityTypeConfiguration<AppAttribute>
    {
        public void Configure(EntityTypeBuilder<AppAttribute> builder)
        {
            builder.HasIndex(a => a.Name).IsUnique();
        }
    }
}
