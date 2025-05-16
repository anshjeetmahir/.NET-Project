
using HospitalManagementSystem.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HospitalManagementSystem.DAL.EntitiesConfiguration
{
    public class RoleConfiguration : IEntityTypeConfiguration<Roles>
    {
        public void Configure(EntityTypeBuilder<Roles> builder)
        {
            builder.HasKey(r => r.RoleId);

            builder.Property(r => r.RoleName)
                   .IsRequired()
                   .HasMaxLength(50);

            builder.HasIndex(r => r.RoleName).IsUnique();

            builder.HasMany(r => r.UserRoles)
               .WithOne(ur => ur.Role)
               .HasForeignKey(ur => ur.RoleId)
               .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
