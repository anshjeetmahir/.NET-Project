
using HospitalManagementSystem.DAL.Entities;

namespace HospitalManagementSystem.BLL.Interfaces.RepositoryInterfaces
{
    public interface IUserRepository
    {
        Task<int> AddUserAsync(Users user);
        Task<Roles?> GetRoleByNameAsync(string roleName);

        Task<int> DeleteUserAsync(int userId);

        Task<Users?> GetUserByUsernameAsync(string username);

        Task<bool> UserNameExistsAsync(string userName);


    }
}
