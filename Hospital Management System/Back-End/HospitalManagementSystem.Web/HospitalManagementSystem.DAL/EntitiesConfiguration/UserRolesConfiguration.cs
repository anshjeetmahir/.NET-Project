
using HospitalManagementSystem.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HospitalManagementSystem.DAL.EntitiesConfiguration
{
    public class UserRolesConfiguration : IEntityTypeConfiguration<UserRoles>
    {
        public void Configure(EntityTypeBuilder<UserRoles> builder)
        {
            builder.HasKey(ur => new { ur.UserId, ur.RoleId });

            builder.HasOne(ur => ur.User)
                   .WithMany(u => u.UserRoles)
                   .HasForeignKey(ur => ur.UserId);

            builder.HasOne(ur => ur.Role)
                   .WithMany(r => r.UserRoles)
                   .HasForeignKey(ur => ur.RoleId);
        }
    }
}
