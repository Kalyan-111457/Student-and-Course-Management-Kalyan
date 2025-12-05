using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UseCaseFinalSubmission.Models;

namespace UseCaseFinalSubmission.Database.Config
{
    public class AdminConfig : IEntityTypeConfiguration<Admin>
    {
        public void Configure(EntityTypeBuilder<Admin> builder)
        {

            builder.Property(n => n.AdminId).UseIdentityColumn();

            builder.Property(n => n.Email).HasMaxLength(50).IsRequired();

            builder.Property(n => n.Password).HasMaxLength(50).IsRequired();

            builder.HasIndex(n => n.Email).IsUnique();
                                          
            Admin obj = new Admin()
            {
                AdminId = 1,
                Email = "Praveen@example.com",
                Password="Raju"
            };



            builder.HasData(obj);


        }
    }
}
