using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using server.Entities;

namespace server.Data.Configurations
{
    public class AttributeTypeConfiguration : IEntityTypeConfiguration<AttributeType>
    {
        public void Configure(EntityTypeBuilder<AttributeType> builder)
        {
            builder.HasIndex(a => a.Name).IsUnique();

            var attributeTypes = AttributeTypes.All.Select((name, index) => new AttributeType
            {
                Id = index + 1,
                Name = name
            });

            builder.HasData(attributeTypes);
        }
    }
}
