

using HospitalManagementSystem.DAL.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagementSystem.DAL.EntitiesConfiguration
{
    public class UserConfiguration : IEntityTypeConfiguration<Users>
    {
        public void Configure(EntityTypeBuilder<Users> builder)
        {
            builder.HasKey(u => u.UserId);

            builder.Property(u => u.UserName)
                   .IsRequired()
                   .HasMaxLength(50);

            builder.HasIndex(u => u.UserName).IsUnique();

            builder.Property(u => u.Password)
                   .IsRequired();

            builder.HasMany(u => u.UserRoles)
              .WithOne(ur => ur.User)
              .HasForeignKey(ur => ur.UserId)
              .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(u => u.Doctor)
                   .WithOne(d => d.User)
                   .HasForeignKey<Doctors>(d => d.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(u => u.Patient)
                   .WithOne(p => p.User)
                   .HasForeignKey<Patients>(p => p.UserId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }

}
