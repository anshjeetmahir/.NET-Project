
using HospitalManagementSystem.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HospitalManagementSystem.DAL.EntitiesConfiguration
{
    public class AppointmentConfiguration : IEntityTypeConfiguration<Appointments>
    {
        public void Configure(EntityTypeBuilder<Appointments> builder)
        {
            builder.HasKey(a => a.AppointmentId);

            builder.HasOne(a => a.Patient)
                   .WithMany(p => p.Appointments)
                   .HasForeignKey(a => a.PatientId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(a => a.Doctor)
                   .WithMany(d => d.Appointments)
                   .HasForeignKey(a => a.DoctorId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.Property(a => a.AppointmentDate).IsRequired();
            builder.Property(a => a.Status).IsRequired().HasMaxLength(50);

            builder.HasIndex(a => a.AppointmentDate); 

            builder.Property(a => a.CreatedBy).IsRequired();
            builder.Property(a => a.CreatedDate).IsRequired();
        }
    }
}
