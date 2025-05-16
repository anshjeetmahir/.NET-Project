

using HospitalManagementSystem.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HospitalManagementSystem.DAL.EntitiesConfiguration
{
    public class DoctorConfiguration : IEntityTypeConfiguration<Doctors>
    {
        public void Configure(EntityTypeBuilder<Doctors> builder)
        {
            builder.HasKey(d => d.DoctorId);

            builder.Property(d => d.FirstName).IsRequired()
                .HasMaxLength(50);

            builder.Property(d => d.LastName)
                .HasMaxLength(50);

            builder.Property(d => d.Specialization)
               .IsRequired();

            builder.Property(d => d.Email)
                .HasMaxLength(100);

            builder.HasIndex(d => d.Email).IsUnique(); 

            builder.HasMany(d => d.Appointments)
                   .WithOne(a => a.Doctor)
                   .HasForeignKey(a => a.DoctorId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(d => d.User)
            .WithOne(u => u.Doctor)
            .HasForeignKey<Doctors>(d => d.UserId)
            .OnDelete(DeleteBehavior.Cascade);


            builder.Property(d => d.CreatedBy)
                .IsRequired();

            builder.Property(d => d.CreatedDate)
                .IsRequired();
        }
    }
}
