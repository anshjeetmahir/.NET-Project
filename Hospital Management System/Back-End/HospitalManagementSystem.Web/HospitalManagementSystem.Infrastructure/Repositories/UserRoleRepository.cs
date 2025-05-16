using HospitalManagementSystem.BLL.Interfaces.RepositoryInterfaces;
using HospitalManagementSystem.DAL.DBContext;
using HospitalManagementSystem.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HospitalManagementSystem.Infrastructure.Repositories
{
    public class UserRoleRepository : IUserRoleRepository
    {
        private readonly ApplicationDbContext _ctx;
        private readonly ILogger<UserRoleRepository> _logger;  

        public UserRoleRepository(ApplicationDbContext ctx, ILogger<UserRoleRepository> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public async Task AddUserRoleAsync(int userId, int roleId)
        {
            _logger.LogInformation("Attempting to add role {RoleId} to user {UserId}.", roleId, userId);

            try
            {
                _ctx.UserRoles.Add(new UserRoles { UserId = userId, RoleId = roleId });
                await _ctx.SaveChangesAsync();

                _logger.LogInformation("Role {RoleId} successfully added to user {UserId}.", roleId, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding role {RoleId} to user {UserId}.", roleId, userId);
                throw;  
            }
        }

        public async Task RemoveUserRoleAsync(int userId, int roleId)
        {
            _logger.LogInformation("Attempting to remove role {RoleId} from user {UserId}.", roleId, userId);

            try
            {
                var ur = await _ctx.UserRoles
                    .FirstOrDefaultAsync(x => x.UserId == userId && x.RoleId == roleId);

                if (ur != null)
                {
                    _ctx.UserRoles.Remove(ur);
                    await _ctx.SaveChangesAsync();
                    _logger.LogInformation("Role {RoleId} successfully removed from user {UserId}.", roleId, userId);
                }
                else
                {
                    _logger.LogWarning("No role {RoleId} found for user {UserId}. No removal occurred.", roleId, userId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while removing role {RoleId} from user {UserId}.", roleId, userId);
                throw;
            }
        }

        public async Task<bool> UserHasRoleAsync(int userId, int roleId)
        {
            _logger.LogInformation("Checking if user {UserId} has role {RoleId}.", userId, roleId);

            try
            {
                var result = await _ctx.UserRoles
                    .AnyAsync(ur => ur.UserId == userId && ur.RoleId == roleId);

                if (result)
                {
                    _logger.LogInformation("User {UserId} has role {RoleId}.", userId, roleId);
                }
                else
                {
                    _logger.LogInformation("User {UserId} does not have role {RoleId}.", userId, roleId);
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while checking if user {UserId} has role {RoleId}.", userId, roleId);
                throw;
            }
        }

        public async Task<IList<string>> GetRolesForUserAsync(int userId)
        {
            _logger.LogInformation("Fetching roles for user {UserId}.", userId);

            try
            {
                var roles = await _ctx.UserRoles
                    .Where(ur => ur.UserId == userId)
                    .Include(ur => ur.Role)
                    .Select(ur => ur.Role.RoleName)
                    .ToListAsync();

                if (roles.Any())
                {
                    _logger.LogInformation("Found {RoleCount} roles for user {UserId}.", roles.Count, userId);
                }
                else
                {
                    _logger.LogWarning("No roles found for user {UserId}.", userId);
                }

                return roles;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching roles for user {UserId}.", userId);
                throw;
            }
        }
    }
}
