using HospitalManagementSystem.BLL.Interfaces.RepositoryInterfaces;
using HospitalManagementSystem.DAL.DBContext;
using HospitalManagementSystem.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HospitalManagementSystem.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UserRepository> _logger;

        public UserRepository(ApplicationDbContext context, ILogger<UserRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<int> AddUserAsync(Users user)
        {
            try
            {
                _logger.LogInformation("Adding a new user with username: {Username}", user.UserName);
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                _logger.LogInformation("User with username: {Username} added successfully. UserId: {UserId}", user.UserName, user.UserId);
                return user.UserId;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding user with username: {Username}", user.UserName);
                throw; 
            }
        }

        public async Task<Roles?> GetRoleByNameAsync(string roleName)
        {
            try
            {
                _logger.LogInformation("Fetching role by name: {RoleName}", roleName);
                var role = await _context.Roles
                    .FirstOrDefaultAsync(r => r.RoleName == roleName);

                if (role != null)
                {
                    _logger.LogInformation("Role found: {RoleName}", roleName);
                }
                else
                {
                    _logger.LogWarning("Role with name: {RoleName} not found", roleName);
                }

                return role;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching role by name: {RoleName}", roleName);
                throw; 
            }
        }

        public async Task<int> DeleteUserAsync(int userId)
        {
            try
            {
                _logger.LogInformation("Deleting user with ID: {UserId}", userId);
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    _logger.LogWarning("User with ID: {UserId} not found", userId);
                    return 0;
                }

                _context.Users.Remove(user);
                var result = await _context.SaveChangesAsync();
                _logger.LogInformation("User with ID: {UserId} deleted successfully.", userId);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting user with ID: {UserId}", userId);
                throw; 
            }
        }

        public async Task<Users?> GetUserByUsernameAsync(string username)
        {
            try
            {
                _logger.LogInformation("Fetching user with username: {Username}", username);
                var user = await _context.Users
                    .Include(u => u.UserRoles)
                        .ThenInclude(ur => ur.Role)
                    .FirstOrDefaultAsync(u => u.UserName == username);

                if (user != null)
                {
                    _logger.LogInformation("User with username: {Username} found.", username);
                }
                else
                {
                    _logger.LogWarning("User with username: {Username} not found.", username);
                }

                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching user with username: {Username}", username);
                throw; 
            }
        }

        public async Task<bool> UserNameExistsAsync(string userName)
        {
            try
            {
                _logger.LogInformation("Checking if username exists: {UserName}", userName);
                var exists = await _context.Users.AnyAsync(u => u.UserName == userName);
                if (exists)
                {
                    _logger.LogInformation("Username {UserName} exists.", userName);
                }
                else
                {
                    _logger.LogInformation("Username {UserName} does not exist.", userName);
                }

                return exists;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while checking if username exists: {UserName}", userName);
                throw;
            }
        }
    }
}
