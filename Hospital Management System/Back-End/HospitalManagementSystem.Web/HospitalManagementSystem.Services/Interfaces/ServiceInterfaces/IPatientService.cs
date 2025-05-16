



using HospitalManagementSystem.BLL.DTOs.Patients;

namespace HospitalManagementSystem.BLL.Interfaces.ServiceInterfaces
{
    public interface IPatientService { 
        Task<IEnumerable<PatientResponseModel>> GetAllPatientsAsync(); 
        Task<PatientResponseModel?> GetPatientByIdAsync(int id); 
        Task<int> CreatePatientAsync(PatientRequestModel model, string user); 
        Task<int> UpdatePatientAsync(int id, PatientRequestModel model, string user); 
        Task<int> DeletePatientAsync(int id); }
    
}
