

using HospitalManagementSystem.DAL.Entities;

namespace HospitalManagementSystem.BLL.Interfaces.RepositoryInterfaces
{
    public interface IDoctorRepository
    {
        Task<IEnumerable<Doctors>> GetAllDoctorsAsync();
        Task<Doctors?> GetDoctorByIdAsync(int id);
        Task<int> AddDoctorAsync(Doctors entity);
        Task<int> UpdateDoctorAsync(Doctors entity);
        Task<int> DeleteDoctorAsync(int id);

        Task<bool> EmailExistsAsync(string? email);

        Task<Doctors?> GetDoctorByNameAsync(string fullName);
    }
}
