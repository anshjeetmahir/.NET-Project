

using HospitalManagementSystem.DAL.Entities;

namespace HospitalManagementSystem.BLL.Interfaces.RepositoryInterfaces
{
    public interface IPatientRepository
    {
        Task<IEnumerable<Patients>> GetAllPatientsAsync();
        Task<Patients?> GetPatientByIdAsync(int id);
        Task<int> AddPatientAsync(Patients entity);
        Task<int> UpdatePatientAsync(Patients entity);
        Task<int> DeletePatientAsync(int id);

        Task<bool> EmailExistsAsync(string? email);

        Task<Patients?> GetPatientByNameAsync(string fullName);
    }
}
