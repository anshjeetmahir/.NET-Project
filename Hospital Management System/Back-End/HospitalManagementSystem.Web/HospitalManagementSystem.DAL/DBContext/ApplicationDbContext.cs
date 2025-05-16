using HospitalManagementSystem.DAL.Entities;
using HospitalManagementSystem.DAL.EntitiesConfiguration;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagementSystem.DAL.DBContext
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        
        public DbSet<Doctors> Doctors { get; set; }
        public DbSet<Patients> Patients { get; set; }
        public DbSet<Appointments> Appointments { get; set; }
        public DbSet<Roles> Roles { get; set; }
        public DbSet<Users> Users { get; set; }
        public DbSet<UserRoles> UserRoles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
           
            modelBuilder.ApplyConfiguration(new DoctorConfiguration());
            modelBuilder.ApplyConfiguration(new PatientConfiguration());
            modelBuilder.ApplyConfiguration(new AppointmentConfiguration());
            modelBuilder.ApplyConfiguration(new RoleConfiguration());
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new UserRolesConfiguration());
        }
    }
}
