

using HospitalManagementSystem.DAL.Entities;

namespace HospitalManagementSystem.BLL.Interfaces.RepositoryInterfaces
{
    public interface IAppointmentRepository
    {
        Task<IEnumerable<Appointments>> GetAllAppointmentsAsync();
        Task<Appointments?> GetAppointmentByIdAsync(int id);
        Task<int> AddAppointmentAsync(Appointments entity);
        Task<int> UpdateAppointmentAsync(Appointments entity);
        Task<int> DeleteAppointmentAsync(int id);
    }
}
