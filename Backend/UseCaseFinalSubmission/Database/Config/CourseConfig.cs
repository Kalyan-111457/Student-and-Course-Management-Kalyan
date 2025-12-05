using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UseCaseFinalSubmission.Models;

namespace UseCaseFinalSubmission.Database.Config
{
    public class CourseConfig : IEntityTypeConfiguration<Course>
    {
        public void Configure(EntityTypeBuilder<Course> builder)
        {

            builder.Property(n => n.CourseId).UseIdentityColumn();

            builder.Property(n => n.CourseName).HasMaxLength(50).IsRequired();

            builder.Property(n => n.CourseDescription).HasMaxLength(250).IsRequired();

            builder.Property(n => n.Capacity).IsRequired();

        }
    }
}
