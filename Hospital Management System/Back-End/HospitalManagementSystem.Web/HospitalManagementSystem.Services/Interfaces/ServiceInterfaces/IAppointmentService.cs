
using HospitalManagementSystem.BLL.DTOs.Appointments;

namespace HospitalManagementSystem.BLL.Interfaces.ServiceInterfaces
{
    public interface IAppointmentService { 
        Task<IEnumerable<AppointmentResponseModel>> GetAllAppointmentsAsync(); 
        Task<AppointmentResponseModel?> GetAppointmentByIdAsync(int id); 
        Task<int> CreateAppointmentAsync(BookAppointmentRequestModel model, string user); 
        Task<int> PatchAppointmentAsync(int id, PatchAppointmentRequest model, string user); 
        Task<int> DeleteAppointmentAsync(int id); }

}
