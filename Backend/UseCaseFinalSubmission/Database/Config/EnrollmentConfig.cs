using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UseCaseFinalSubmission.Models;

namespace UseCaseFinalSubmission.Database.Config
{
    public class EnrollmentConfig : IEntityTypeConfiguration<Enrollement>
    {
        public void Configure(EntityTypeBuilder<Enrollement> builder)
        {

            builder.HasOne(n => n.student).WithMany(n => n.Enrollements).HasForeignKey(n => n.StudentId);

            builder.HasOne(n => n.course).WithMany(n => n.Enrollements).HasForeignKey(n => n.CourseId);

            builder.HasIndex(n => new { n.StudentId, n.CourseId }).IsUnique();
        }
    }
}
