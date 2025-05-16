using AutoMapper;
using HospitalManagementSystem.BLL.DTOs.Patients;
using HospitalManagementSystem.BLL.Interfaces.RepositoryInterfaces;
using HospitalManagementSystem.BLL.Interfaces.ServiceInterfaces;
using HospitalManagementSystem.DAL.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace HospitalManagementSystem.BLL.Services
{
    public class PatientService : IPatientService
    {
        private readonly IPatientRepository _repo;
        private readonly IUserRepository _userRepo;
        private readonly IUserRoleRepository _userRoleRepo;
        private readonly IAppointmentRepository _appointmentRepo;
        private readonly IMapper _mapper;
        private readonly IPasswordHasher<Users> _passwordHasher;
         private readonly ILogger<PatientService> _logger;

        public PatientService(
            IPatientRepository repo,
            IUserRepository userRepo,
            IAppointmentRepository appointmentRepo,
            IUserRoleRepository userRoleRepo,
            IMapper mapper,
            IPasswordHasher<Users> passwordHasher,
            ILogger<PatientService> logger)  
        {
            _repo = repo;
            _userRepo = userRepo;
            _appointmentRepo = appointmentRepo;
            _userRoleRepo = userRoleRepo;
            _mapper = mapper;
            _passwordHasher = passwordHasher;
            _logger = logger;  
        }


        public async Task<IEnumerable<PatientResponseModel>> GetAllPatientsAsync()
        {
            _logger.LogInformation("Fetching all patients");
            var entities = await _repo.GetAllPatientsAsync();
            _logger.LogInformation($"Fetched {entities.Count()} patients");

            return _mapper.Map<IEnumerable<PatientResponseModel>>(entities);
        }

        public async Task<PatientResponseModel?> GetPatientByIdAsync(int id)
        {
            _logger.LogInformation($"Fetching patient with ID {id}");
            var entity = await _repo.GetPatientByIdAsync(id);
            if (entity == null)
            {
                _logger.LogWarning($"Patient with ID {id} not found");
                return null;
            }

            _logger.LogInformation($"Found patient with ID {id}");
            return _mapper.Map<PatientResponseModel>(entity);
        }

        public async Task<int> CreatePatientAsync(PatientRequestModel model, string createdBy)
        {
            var email = string.IsNullOrWhiteSpace(model.Email)
                   ? null
                   : model.Email.Trim();

            if (await _repo.EmailExistsAsync(email))
                throw new InvalidOperationException(
                    $"A patient with email '{model.Email}' already exists.");

            _logger.LogInformation($"Creating patient with username: {model.UserName}");

            var user = _mapper.Map<Users>(model);
            user.Password = _passwordHasher.HashPassword(user, model.Password);
            var userId = await _userRepo.AddUserAsync(user);

            _logger.LogInformation($"User created with ID {userId}");

            var patientRole = await _userRepo.GetRoleByNameAsync("Patient")
                               ?? throw new ArgumentException("Default role 'Patient' not found");

            await _userRoleRepo.AddUserRoleAsync(userId, patientRole.RoleId);
            _logger.LogInformation($"Assigned 'Patient' role to user {userId}");

            foreach (var roleName in model.Roles
                                           .Where(r => !r.Equals("Patient", StringComparison.OrdinalIgnoreCase))
                                           .Select(r => r.Trim())
                                           .Where(r => !string.IsNullOrEmpty(r))
                                           .Distinct(StringComparer.OrdinalIgnoreCase))
            {
                var extra = await _userRepo.GetRoleByNameAsync(roleName)
                            ?? throw new ArgumentException($"Role '{roleName}' not found");

                if (!await _userRoleRepo.UserHasRoleAsync(userId, extra.RoleId))
                {
                    await _userRoleRepo.AddUserRoleAsync(userId, extra.RoleId);
                    _logger.LogInformation($"Assigned additional role '{roleName}' to user {userId}");
                }
            }

            var patient = _mapper.Map<Patients>(model);
            patient.UserId = userId;
            patient.CreatedBy = createdBy;
            patient.CreatedDate = DateTime.UtcNow;

            var patientId = await _repo.AddPatientAsync(patient);
            _logger.LogInformation($"Patient created with ID {patientId}");

            return patientId;
        }

        public async Task<int> UpdatePatientAsync(int id, PatientRequestModel model, string updatedBy)
        {


            _logger.LogInformation($"Updating patient with ID {id}");

            var entity = await _repo.GetPatientByIdAsync(id)
                                 ?? throw new KeyNotFoundException($"Patient {id} not found");

            var normalizedEmail = string.IsNullOrWhiteSpace(model.Email)
                                     ? null
                                     : model.Email.Trim();

            if (normalizedEmail != null
                && !string.Equals(normalizedEmail, entity.Email, StringComparison.OrdinalIgnoreCase)
                && await _repo.EmailExistsAsync(normalizedEmail))
            {
                throw new InvalidOperationException(
                    $"A patient with email '{normalizedEmail}' already exists.");
            }

            if (entity.User != null)
            {
                entity.User.UserName = model.UserName;
                if (!string.IsNullOrWhiteSpace(model.Password))
                {
                    entity.User.Password = _passwordHasher.HashPassword(entity.User, model.Password);
                    _logger.LogInformation($"Password updated for user {entity.User.UserId}");
                }

                var currentRoles = (await _userRoleRepo.GetRolesForUserAsync(entity.User.UserId))
                    .ToHashSet(StringComparer.OrdinalIgnoreCase);

                var desiredRoles = model.Roles
                    .Select(r => r.Trim())
                    .Where(r => !string.IsNullOrEmpty(r))
                    .ToHashSet(StringComparer.OrdinalIgnoreCase);

                desiredRoles.Add("Patient");

                foreach (var r in currentRoles.Except(desiredRoles))
                {
                    var role = await _userRepo.GetRoleByNameAsync(r);
                    if (role != null)
                    {
                        await _userRoleRepo.RemoveUserRoleAsync(entity.User.UserId, role.RoleId);
                        _logger.LogInformation($"Removed role '{r}' from user {entity.User.UserId}");
                    }
                }

                foreach (var r in desiredRoles.Except(currentRoles))
                {
                    var role = await _userRepo.GetRoleByNameAsync(r)
                                ?? throw new InvalidOperationException($"Role '{r}' not found.");
                    await _userRoleRepo.AddUserRoleAsync(entity.User.UserId, role.RoleId);
                    _logger.LogInformation($"Assigned role '{r}' to user {entity.User.UserId}");
                }
            }

            entity.FirstName = model.FirstName;
            entity.LastName = model.LastName;
            entity.DateOfBirth = model.DateOfBirth;
            entity.Email = normalizedEmail;
            entity.PhoneNumber = model.PhoneNumber;
            entity.Address = model.Address;
            entity.UpdatedBy = updatedBy;
            entity.UpdatedDate = DateTime.UtcNow;
            

            var updatedPatientId = await _repo.UpdatePatientAsync(entity);
            _logger.LogInformation($"Patient with ID {id} updated successfully");

            return updatedPatientId;
        }

        public async Task<int> DeletePatientAsync(int id)
        {
            _logger.LogInformation($"Deleting patient with ID {id}");

            var exists = await _repo.GetPatientByIdAsync(id);
            if (exists == null)
            {
                _logger.LogWarning($"Patient with ID {id} not found");
                throw new KeyNotFoundException($"Patient with ID {id} not found");
            }

            foreach (var a in exists.Appointments)
            {
                await _appointmentRepo.DeleteAppointmentAsync(a.AppointmentId);
                _logger.LogInformation($"Deleted appointment with ID {a.AppointmentId}");
            }

            await _userRepo.DeleteUserAsync(exists.UserId);
            _logger.LogInformation($"Deleted user with ID {exists.UserId}");

            await _repo.DeletePatientAsync(id);
            _logger.LogInformation($"Patient with ID {id} deleted successfully");

            return id;
        }

    }
}
