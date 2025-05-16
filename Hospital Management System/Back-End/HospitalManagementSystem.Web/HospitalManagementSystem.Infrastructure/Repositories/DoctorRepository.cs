using HospitalManagementSystem.BLL.Interfaces.RepositoryInterfaces;
using HospitalManagementSystem.DAL.DBContext;
using HospitalManagementSystem.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;


namespace HospitalManagementSystem.Infrastructure.Repositories
{
    public class DoctorRepository : IDoctorRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<DoctorRepository> _logger;

        public DoctorRepository(ApplicationDbContext context, ILogger<DoctorRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Doctors>> GetAllDoctorsAsync()
        {
            _logger.LogInformation("Fetching all doctors from the database.");
            var doctors = await _context.Doctors
                .Include(d => d.User)
                .ToListAsync();

            _logger.LogInformation("Fetched {Count} doctors.", doctors.Count());
            return doctors;
        }

        public async Task<Doctors?> GetDoctorByIdAsync(int id)
        {
            _logger.LogInformation("Fetching doctor with ID: {DoctorId}", id);
            var doctor = await _context.Doctors
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.DoctorId == id);

            if (doctor == null)
            {
                _logger.LogWarning("Doctor with ID {DoctorId} not found.", id);
            }
            return doctor;
        }

        public async Task<int> AddDoctorAsync(Doctors entity)
        {
            _logger.LogInformation("Adding new doctor: {DoctorName}", entity.FirstName + " " + entity.LastName);
            _context.Doctors.Add(entity);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Doctor with ID {DoctorId} added successfully.", entity.DoctorId);
            return entity.DoctorId;
        }

        public async Task<int> UpdateDoctorAsync(Doctors entity)
        {
            _logger.LogInformation("Updating doctor with ID: {DoctorId}", entity.DoctorId);
            _context.Doctors.Update(entity);
            if (entity.User != null)
            {
                _context.Entry(entity.User).State = EntityState.Modified;
            }
            await _context.SaveChangesAsync();
            _logger.LogInformation("Doctor with ID {DoctorId} updated successfully.", entity.DoctorId);
            return entity.DoctorId;
        }

        public async Task<int> DeleteDoctorAsync(int id)
        {
            _logger.LogInformation("Deleting doctor with ID: {DoctorId}", id);
            var e = await _context.Doctors.FindAsync(id);
            if (e == null)
            {
                _logger.LogWarning("Doctor with ID {DoctorId} not found for deletion.", id);
                return 0;
            }

            _context.Doctors.Remove(e);
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                _logger.LogInformation("Doctor with ID {DoctorId} deleted successfully.", id);
            }
            else
            {
                _logger.LogWarning("Failed to delete doctor with ID {DoctorId}.", id);
            }
            return result;
        }

        public async Task<bool> EmailExistsAsync(string? email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                _logger.LogWarning("Email is null or empty, skipping email existence check.");
                return false;
            }

            _logger.LogInformation("Checking if email {Email} exists in the system.", email);
            var exists = await _context.Doctors.AnyAsync(p => p.Email!.ToLower() == email.ToLower());
            _logger.LogInformation("Email {Email} exists: {Exists}", email, exists);
            return exists;
        }

        public async Task<Doctors?> GetDoctorByNameAsync(string fullName)
        {
            if (string.IsNullOrWhiteSpace(fullName))
            {
                _logger.LogWarning("Full name is null or empty, skipping doctor search by name.");
                return null;
            }

            var parts = fullName.Trim().Split(' ', 2, StringSplitOptions.RemoveEmptyEntries);
            var first = parts[0].ToLower();
            var last = parts.Length > 1 ? parts[1].ToLower() : null;

            _logger.LogInformation("Searching for doctor with name: {FullName}", fullName);
            var query = _context.Doctors
                .Where(d => d.FirstName.ToLower() == first);

            if (!string.IsNullOrWhiteSpace(last))
            {
                query = query.Where(d =>
                    d.LastName != null && d.LastName.ToLower() == last);
            }
            else
            {
                query = query.Where(d => string.IsNullOrWhiteSpace(d.LastName));
            }

            var doctor = await query.FirstOrDefaultAsync();
            if (doctor != null)
            {
                _logger.LogInformation("Doctor {FullName} found with ID {DoctorId}.", fullName, doctor.DoctorId);
            }
            else
            {
                _logger.LogWarning("No doctor found for name: {FullName}.", fullName);
            }

            return doctor;
        }
    }
}
