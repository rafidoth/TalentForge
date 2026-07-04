using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using server.Entities;

namespace server.Data.Configurations
{
    public class ProjectTechnologyTagConfiguration : IEntityTypeConfiguration<ProjectTechnologyTag>
    {
        public void Configure(EntityTypeBuilder<ProjectTechnologyTag> builder)
        {
            builder.HasKey(pt => new { pt.ProjectId, pt.TagId });
        }
    }
}
