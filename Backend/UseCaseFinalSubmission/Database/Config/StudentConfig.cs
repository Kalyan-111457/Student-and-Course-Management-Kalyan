using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UseCaseFinalSubmission.Models;

namespace UseCaseFinalSubmission.Database.Config
{
    public class StudentConfig : IEntityTypeConfiguration<Student>
    {
        public void Configure(EntityTypeBuilder<Student> builder)
        {

            builder.Property(n => n.StudentId).UseIdentityColumn();

            builder.Property(n => n.FullName).HasMaxLength(50).IsRequired();

            builder.Property(n => n.Password).HasMaxLength(250).IsRequired();

            builder.Property(n => n.Email).HasMaxLength(20).IsRequired();

            builder.Property(n => n.Phone).HasMaxLength(10).IsRequired();

            builder.Property(s => s.Role).IsRequired().HasMaxLength(50);


            builder.HasIndex(n => new { n.Email ,n.Phone}).IsUnique();



        }
    }
}