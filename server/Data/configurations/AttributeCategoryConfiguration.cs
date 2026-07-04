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

            var attributeCategoryNames = new[] {
                "Personal Information",
                "Certifications",
                "Domain Knowledge",
                "Soft Skills",
                };

            var attributeCategories = attributeCategoryNames.Select((name, index) => new AttributeCategory
            {
                Id = index + 1,
                Name = name
            });

            builder.HasData(attributeCategories);

        }
    }
}
