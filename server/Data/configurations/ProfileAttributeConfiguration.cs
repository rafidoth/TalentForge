using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using server.Entities;

namespace server.Data.Configurations
{
    public class ProfileAttributeConfiguration : IEntityTypeConfiguration<ProfileAttribute>
    {
        public void Configure(EntityTypeBuilder<ProfileAttribute> builder)
        {
            builder.HasIndex(p => new { p.UserId, p.AttributeId }).IsUnique();
        }
    }
}
