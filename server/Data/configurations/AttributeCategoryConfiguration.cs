using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using server.Entities;

namespace server.Data.Configurations
{
    public class AttributeCategoryConfiguration : IEntityTypeConfiguration<AttributeCategory>
    {
        public void Configure(EntityTypeBuilder<AttributeCategory> builder)
        {
            builder.HasIndex(a => a.Name).IsUnique();
        }
    }
}
