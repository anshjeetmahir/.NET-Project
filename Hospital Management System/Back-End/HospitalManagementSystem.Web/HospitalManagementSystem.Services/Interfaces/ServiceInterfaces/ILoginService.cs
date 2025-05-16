

using HospitalManagementSystem.BLL.DTOs.Login;

namespace HospitalManagementSystem.BLL.Interfaces.ServiceInterfaces
{
    public interface ILoginService
    {
        Task<LoginResponseModel> LoginServiceAsync(LoginRequestModel request);
    }
}
