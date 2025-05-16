

using HospitalManagementSystem.BLL.DTOs.Doctors;

namespace HospitalManagementSystem.BLL.Interfaces.ServiceInterfaces
{
    public interface IDoctorService { 
        Task<IEnumerable<DoctorResponseModel>> GetAllDoctorsAsync(); 
        Task<DoctorResponseModel?> GetDoctorByIdAsync(int id); 
        Task<int> CreateDoctorAsync(DoctorRequestModel model, string user); 
        Task<int> UpdateDoctorAsync(int id, DoctorRequestModel model, string user);
        Task<int> DeleteDoctorAsync(int id); }
    
}
