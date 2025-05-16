using HospitalManagementSystem.BLL.Interfaces.RepositoryInterfaces;
using HospitalManagementSystem.DAL.DBContext;
using HospitalManagementSystem.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HospitalManagementSystem.Infrastructure.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AppointmentRepository> _logger;

        public AppointmentRepository(ApplicationDbContext context, ILogger<AppointmentRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Appointments>> GetAllAppointmentsAsync()
        {
            _logger.LogInformation("Fetching all appointments...");
            var appointments = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .ToListAsync();

            if (appointments.Any())
                _logger.LogInformation("Successfully retrieved {Count} appointments.", appointments.Count);
            else
                _logger.LogWarning("No appointments found.");

            return appointments;
        }

        public async Task<Appointments?> GetAppointmentByIdAsync(int id)
        {
            _logger.LogInformation("Fetching appointment by ID: {Id}", id);
            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .FirstOrDefaultAsync(a => a.AppointmentId == id);

            if (appointment == null)
                _logger.LogWarning("Appointment with ID {Id} not found.", id);
            else
                _logger.LogInformation("Appointment with ID {Id} retrieved successfully.", id);

            return appointment;
        }

        public async Task<int> AddAppointmentAsync(Appointments entity)
        {
            _logger.LogInformation("Adding new appointment...");
            _context.Appointments.Add(entity);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Appointment with ID {Id} added successfully.", entity.AppointmentId);
            return entity.AppointmentId;
        }

        public async Task<int> UpdateAppointmentAsync(Appointments entity)
        {
            _logger.LogInformation("Updating appointment with ID {Id}...", entity.AppointmentId);
            _context.Appointments.Update(entity);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Appointment with ID {Id} updated successfully.", entity.AppointmentId);
            return entity.AppointmentId;
        }

        public async Task<int> DeleteAppointmentAsync(int id)
        {
            _logger.LogInformation("Attempting to delete appointment with ID {Id}...", id);
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                _logger.LogWarning("Appointment with ID {Id} not found for deletion.", id);
                return 0;
            }

            _context.Appointments.Remove(appointment);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
                _logger.LogInformation("Appointment with ID {Id} deleted successfully.", id);
            else
                _logger.LogError("Failed to delete appointment with ID {Id}.", id);

            return result;
        }
    }
}
