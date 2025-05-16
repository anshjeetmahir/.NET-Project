

namespace HospitalManagementSystem.BLL.Interfaces.RepositoryInterfaces
{
    public interface IUserRoleRepository
    {
        Task AddUserRoleAsync(int userId, int roleId);

        Task RemoveUserRoleAsync(int userId, int roleId);
        Task<bool> UserHasRoleAsync(int userId, int roleId);
        Task<IList<string>> GetRolesForUserAsync(int userId);
    }

}
