using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using server.Entities;

namespace server.Data.configurations
{
    public class UserPreferenceConfiguration : IEntityTypeConfiguration<AppAttribute>
    {
        public void Configure(EntityTypeBuilder<AppAttribute> builder)
        {

            builder.Property(a => a.CreatedAt).HasDefaultValueSql("now()").ValueGeneratedOnAdd();
        }
    }
}
