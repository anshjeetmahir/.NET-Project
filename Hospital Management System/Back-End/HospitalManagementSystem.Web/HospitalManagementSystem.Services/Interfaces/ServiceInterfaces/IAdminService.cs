
using HospitalManagementSystem.BLL.DTOs.Admin;

namespace HospitalManagementSystem.BLL.Interfaces.ServiceInterfaces
{
    public interface IAdminService
    {
        Task<AdminResponseModel> CreateAdminAsync(AdminRequestModel model);
    }
}
