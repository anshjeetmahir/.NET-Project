using HospitalManagementSystem.BLL.Interfaces.RepositoryInterfaces;
using HospitalManagementSystem.DAL.DBContext;
using HospitalManagementSystem.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;


namespace HospitalManagementSystem.Infrastructure.Repositories
{
    public class PatientRepository : IPatientRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<PatientRepository> _logger;

        public PatientRepository(ApplicationDbContext context, ILogger<PatientRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Patients>> GetAllPatientsAsync()
        {
            _logger.LogInformation("Fetching all patients from the database.");
            var patients = await _context.Patients
                .Include(p => p.User)
                .ToListAsync();

            _logger.LogInformation("Fetched {Count} patients from the database.", patients.Count());
            return patients;
        }

        public async Task<Patients?> GetPatientByIdAsync(int id)
        {
            _logger.LogInformation("Fetching patient with ID {PatientId} from the database.", id);
            var patient = await _context.Patients
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.PatientId == id);

            if (patient == null)
            {
                _logger.LogWarning("Patient with ID {PatientId} not found.", id);
            }
            else
            {
                _logger.LogInformation("Patient with ID {PatientId} found.", id);
            }

            return patient;
        }

        public async Task<int> AddPatientAsync(Patients entity)
        {
            _logger.LogInformation("Adding new patient with name {PatientName}.", entity.FirstName + " " + entity.LastName);
            _context.Patients.Add(entity);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Patient with ID {PatientId} added successfully.", entity.PatientId);
            return entity.PatientId;
        }

        public async Task<int> UpdatePatientAsync(Patients entity)
        {
            _logger.LogInformation("Updating patient with ID {PatientId}.", entity.PatientId);
            _context.Patients.Update(entity);

            if (entity.User != null)
            {
                _context.Entry(entity.User).State = EntityState.Modified;
                _logger.LogInformation("Patient's user details updated for patient ID {PatientId}.", entity.PatientId);
            }

            await _context.SaveChangesAsync();
            _logger.LogInformation("Patient with ID {PatientId} updated successfully.", entity.PatientId);
            return entity.PatientId;
        }

        public async Task<int> DeletePatientAsync(int id)
        {
            _logger.LogInformation("Deleting patient with ID {PatientId}.", id);
            var e = await _context.Patients.FindAsync(id);
            if (e == null)
            {
                _logger.LogWarning("Patient with ID {PatientId} not found for deletion.", id);
                return 0;
            }

            _context.Patients.Remove(e);
            var result = await _context.SaveChangesAsync();
            _logger.LogInformation("Patient with ID {PatientId} deleted successfully.", id);
            return result;
        }

        public async Task<bool> EmailExistsAsync(string? email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                _logger.LogWarning("Email provided is null or empty.");
                return false;
            }

            _logger.LogInformation("Checking if email {Email} exists.", email);
            var exists = await _context.Patients.AnyAsync(p => p.Email!.ToLower() == email.ToLower());
            _logger.LogInformation("Email {Email} existence check result: {Exists}.", email, exists);
            return exists;
        }

        public async Task<Patients?> GetPatientByNameAsync(string fullName)
        {
            if (string.IsNullOrWhiteSpace(fullName))
            {
                _logger.LogWarning("Full name provided is null or empty.");
                return null;
            }

            var parts = fullName.Trim().Split(' ', 2, StringSplitOptions.RemoveEmptyEntries);
            var first = parts[0].ToLower();
            string? last = parts.Length > 1 ? parts[1].Trim().ToLower() : null;

            _logger.LogInformation("Fetching patient by name: FirstName={FirstName}, LastName={LastName}.", first, last);

            var query = _context.Patients.Where(p => p.FirstName.ToLower() == first);
            if (!string.IsNullOrWhiteSpace(last))
            {
                query = query.Where(p => p.LastName != null && p.LastName.ToLower() == last);
            }
            else
            {
                query = query.Where(p => string.IsNullOrWhiteSpace(p.LastName));
            }

            var patient = await query.FirstOrDefaultAsync();

            if (patient == null)
            {
                _logger.LogWarning("No patient found with name {FullName}.", fullName);
            }
            else
            {
                _logger.LogInformation("Patient found with name {FullName}.", fullName);
            }

            return patient;
        }
    }
}
