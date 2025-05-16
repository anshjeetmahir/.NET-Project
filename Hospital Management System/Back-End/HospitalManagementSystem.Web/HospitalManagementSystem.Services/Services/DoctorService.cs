using AutoMapper;
using HospitalManagementSystem.BLL.DTOs.Doctors;
using HospitalManagementSystem.BLL.Interfaces.RepositoryInterfaces;
using HospitalManagementSystem.BLL.Interfaces.ServiceInterfaces;
using HospitalManagementSystem.DAL.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace HospitalManagementSystem.BLL.Services
{
    public class DoctorService : IDoctorService
    {
        private readonly IDoctorRepository _repo;
        private readonly IUserRepository _userRepo;
        private readonly IUserRoleRepository _userRoleRepo;
        private readonly IMapper _mapper;
        private readonly IPasswordHasher<Users> _passwordHasher;
        private readonly ILogger<DoctorService> _logger;

        public DoctorService(
            IDoctorRepository repo,
            IUserRepository userRepo,
            IUserRoleRepository userRoleRepo,
            IMapper mapper,
            IPasswordHasher<Users> passwordHasher,
            ILogger<DoctorService> logger)  
        {
            _repo = repo;
            _userRepo = userRepo;
            _userRoleRepo = userRoleRepo;
            _mapper = mapper;
            _passwordHasher = passwordHasher;
            _logger = logger; 
        }


        public async Task<IEnumerable<DoctorResponseModel>> GetAllDoctorsAsync()
        {
            _logger.LogInformation("Fetching all doctors...");
            var entities = await _repo.GetAllDoctorsAsync();
            _logger.LogInformation("{Count} doctors retrieved.", entities.Count());
            return _mapper.Map<IEnumerable<DoctorResponseModel>>(entities);
        }

        public async Task<DoctorResponseModel?> GetDoctorByIdAsync(int id)
        {
            _logger.LogInformation("Fetching doctor with ID {DoctorId}...", id);
            var entity = await _repo.GetDoctorByIdAsync(id);
            if (entity == null)
            {
                _logger.LogWarning("Doctor with ID {DoctorId} not found.", id);
                return null;
            }
            _logger.LogInformation("Doctor with ID {DoctorId} found.", id);
            return _mapper.Map<DoctorResponseModel>(entity);
        }

        public async Task<int> CreateDoctorAsync(DoctorRequestModel model, string createdBy)
        {


            _logger.LogInformation("Creating a new doctor with username '{UserName}'", model.UserName);

            var email = string.IsNullOrWhiteSpace(model.Email) ? null : model.Email.Trim();
            if (email != null && await _repo.EmailExistsAsync(email))
            {
                _logger.LogError("Email '{Email}' already exists.", email);
                throw new InvalidOperationException($"A doctor with email '{email}' already exists.");
            }

            if (await _userRepo.UserNameExistsAsync(model.UserName))
            {
                _logger.LogError("Username '{UserName}' is already taken.", model.UserName);
                throw new InvalidOperationException($"Username '{model.UserName}' is already taken.");
            }

            var user = _mapper.Map<Users>(model);
            user.Password = _passwordHasher.HashPassword(user, model.Password);
            var userId = await _userRepo.AddUserAsync(user);
            _logger.LogInformation("User with ID {UserId} created.", userId);

            var doctorRole = await _userRepo.GetRoleByNameAsync("Doctor")
                             ?? throw new ArgumentException("Default role 'Doctor' not found");
            await _userRoleRepo.AddUserRoleAsync(userId, doctorRole.RoleId);
            _logger.LogInformation("Assigned 'Doctor' role to user {UserId}.", userId);

            foreach (var roleName in model.Roles
                                           .Where(r => !r.Equals("Doctor", StringComparison.OrdinalIgnoreCase))
                                           .Select(r => r.Trim())
                                           .Where(r => !string.IsNullOrEmpty(r))
                                           .Distinct(StringComparer.OrdinalIgnoreCase))
            {
                var extra = await _userRepo.GetRoleByNameAsync(roleName)
                            ?? throw new ArgumentException($"Role '{roleName}' not found");
                if (!await _userRoleRepo.UserHasRoleAsync(userId, extra.RoleId))
                {
                    await _userRoleRepo.AddUserRoleAsync(userId, extra.RoleId);
                    _logger.LogInformation("Assigned role '{RoleName}' to user {UserId}.", roleName, userId);
                }
            }

            var doctor = _mapper.Map<Doctors>(model);
            doctor.UserId = userId;
            doctor.CreatedBy = createdBy;
            doctor.CreatedDate = DateTime.UtcNow;

            var doctorId = await _repo.AddDoctorAsync(doctor);
            _logger.LogInformation("Doctor with ID {DoctorId} created successfully.", doctorId);

            return doctorId;
        }

        public async Task<int> UpdateDoctorAsync(int id, DoctorRequestModel model, string updatedBy)
        {
            _logger.LogInformation("Updating doctor with ID {DoctorId}...", id);
            var entity = await _repo.GetDoctorByIdAsync(id);
            if (entity == null)
            {
                _logger.LogWarning("Doctor with ID {DoctorId} not found for update.", id);
                throw new KeyNotFoundException($"Doctor with ID {id} not found");
            }

            var email = string.IsNullOrWhiteSpace(model.Email) ? null : model.Email.Trim();
            if (email != null
                && !string.Equals(email, entity.Email, StringComparison.OrdinalIgnoreCase)
                && await _repo.EmailExistsAsync(email))
            {
                _logger.LogError("Email '{Email}' already exists.", email);
                throw new InvalidOperationException($"A doctor with email '{email}' already exists.");
            }

            if (!string.Equals(model.UserName, entity.User?.UserName, StringComparison.OrdinalIgnoreCase)
                && await _userRepo.UserNameExistsAsync(model.UserName))
            {
                _logger.LogError("Username '{UserName}' is already taken.", model.UserName);
                throw new InvalidOperationException($"Username '{model.UserName}' is already taken.");
            }

            entity.FirstName = model.FirstName;
            entity.LastName = model.LastName;
            entity.Specialization = model.Specialization;
            entity.YearsOfExperience = model.YearsOfExperience;
            entity.Email = email;
            entity.UpdatedBy = updatedBy;
            entity.UpdatedDate = DateTime.UtcNow;

            _logger.LogInformation("Doctor with ID {DoctorId} updated successfully.", id);

            if (entity.User != null)
            {
                entity.User.UserName = model.UserName;
                if (!string.IsNullOrWhiteSpace(model.Password))
                {
                    entity.User.Password = _passwordHasher.HashPassword(entity.User, model.Password);
                    _logger.LogInformation("Password updated for user {UserName}.", model.UserName);
                }

                var currentRoles = (await _userRoleRepo.GetRolesForUserAsync(entity.User.UserId))
                                    .ToHashSet(StringComparer.OrdinalIgnoreCase);

                var desiredRoles = model.Roles
                    .Select(r => r.Trim())
                    .Where(r => !string.IsNullOrEmpty(r))
                    .ToHashSet(StringComparer.OrdinalIgnoreCase);

                desiredRoles.Add("Doctor");

                foreach (var r in currentRoles.Except(desiredRoles))
                {
                    var role = await _userRepo.GetRoleByNameAsync(r);
                    if (role != null)
                        await _userRoleRepo.RemoveUserRoleAsync(entity.User.UserId, role.RoleId);
                    _logger.LogInformation("Removed role '{RoleName}' from user {UserId}.", r, entity.User.UserId);
                }

                foreach (var r in desiredRoles.Except(currentRoles))
                {
                    var role = await _userRepo.GetRoleByNameAsync(r)
                                ?? throw new InvalidOperationException($"Role '{r}' not found.");
                    await _userRoleRepo.AddUserRoleAsync(entity.User.UserId, role.RoleId);
                    _logger.LogInformation("Assigned role '{RoleName}' to user {UserId}.", r, entity.User.UserId);
                }
            }

            return await _repo.UpdateDoctorAsync(entity);
        }

        public async Task<int> DeleteDoctorAsync(int id)
        {
            _logger.LogInformation("Deleting doctor with ID {DoctorId}...", id);
            var exists = await _repo.GetDoctorByIdAsync(id);
            if (exists == null)
            {
                _logger.LogWarning("Doctor with ID {DoctorId} not found for deletion.", id);
                throw new KeyNotFoundException($"Doctor with ID {id} not found");
            }

            await _userRepo.DeleteUserAsync(exists.UserId);
            _logger.LogInformation("Doctor with ID {DoctorId} and associated user deleted successfully.", id);

            return await _repo.DeleteDoctorAsync(id);
        }

    }
}
