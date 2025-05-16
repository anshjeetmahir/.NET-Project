

using HospitalManagementSystem.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HospitalManagementSystem.DAL.EntitiesConfiguration
{
    public class PatientConfiguration : IEntityTypeConfiguration<Patients>
    {
        public void Configure(EntityTypeBuilder<Patients> builder)
        {
            builder.HasKey(p => p.PatientId);

            builder.Property(p => p.FirstName).IsRequired().HasMaxLength(50);

            builder.Property(p => p.LastName).HasMaxLength(50);

            builder.Property(p => p.Email).HasMaxLength(100);

            builder.HasIndex(p => p.Email).IsUnique();

            builder.HasMany(p => p.Appointments)
                   .WithOne(a => a.Patient)
                   .HasForeignKey(a => a.PatientId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(p => p.User)
               .WithOne(u => u.Patient)
               .HasForeignKey<Patients>(p => p.UserId)
               .OnDelete(DeleteBehavior.Cascade);

            builder.Property(p => p.CreatedBy).IsRequired();
            builder.Property(p => p.CreatedDate).IsRequired();
        }
    }
}
