using HospitalManagementSystem.BLL.DTOs.Admin;
using HospitalManagementSystem.BLL.Interfaces.RepositoryInterfaces;
using HospitalManagementSystem.BLL.Interfaces.ServiceInterfaces;
using HospitalManagementSystem.DAL.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagementSystem.BLL.Services
{
    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepo;
        private readonly IUserRoleRepository _userRoleRepo;
        private readonly IPasswordHasher<Users> _passwordHasher;
        private readonly ILogger<AdminService> _logger;

        public AdminService(
            IUserRepository userRepo,
            IUserRoleRepository userRoleRepo,
            IPasswordHasher<Users> passwordHasher,
            ILogger<AdminService> logger)
        {
            _userRepo = userRepo;
            _userRoleRepo = userRoleRepo;
            _passwordHasher = passwordHasher;
            _logger = logger;
        }

        public async Task<AdminResponseModel> CreateAdminAsync(AdminRequestModel model)
        {
            _logger.LogInformation("Starting admin creation process for username: {UserName}", model.UserName);

            if (await _userRepo.UserNameExistsAsync(model.UserName))
            {
                _logger.LogWarning("Username '{UserName}' is already taken.", model.UserName);
                throw new InvalidOperationException($"Username '{model.UserName}' is already taken.");
            }

            var user = new Users
            {
                UserName = model.UserName
            };
            user.Password = _passwordHasher.HashPassword(user, model.Password);

            var userId = await _userRepo.AddUserAsync(user);
            _logger.LogInformation("New admin user created with ID: {UserId}", userId);

            return new AdminResponseModel
            {
                UserId = userId,
                UserName = model.UserName
            };
        }
    }
}
