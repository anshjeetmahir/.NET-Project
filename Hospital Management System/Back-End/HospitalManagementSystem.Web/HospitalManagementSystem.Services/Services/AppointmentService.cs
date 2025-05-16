using AutoMapper;
using HospitalManagementSystem.BLL.DTOs.Appointments;
using HospitalManagementSystem.BLL.Interfaces.RepositoryInterfaces;
using HospitalManagementSystem.BLL.Interfaces.ServiceInterfaces;
using HospitalManagementSystem.DAL.Entities;
using Microsoft.Extensions.Logging;

namespace HospitalManagementSystem.BLL.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _repo;
        private readonly IPatientRepository _prepo;
        private readonly IDoctorRepository _drepo;
        private readonly IMapper _mapper;
        private readonly ILogger<AppointmentService> _logger;

        public AppointmentService(
            IAppointmentRepository repo,
            IPatientRepository prepo,
            IDoctorRepository drepo,
            IMapper mapper,
            ILogger<AppointmentService> logger)
        {
            _repo = repo;
            _prepo = prepo;
            _drepo = drepo;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<AppointmentResponseModel>> GetAllAppointmentsAsync()
        {
            _logger.LogInformation("Retrieving all appointments from repository...");
            var entities = await _repo.GetAllAppointmentsAsync();
            _logger.LogInformation("Retrieved {Count} appointments.", entities.Count());
            return _mapper.Map<IEnumerable<AppointmentResponseModel>>(entities);
        }

        public async Task<AppointmentResponseModel?> GetAppointmentByIdAsync(int id)
        {
            _logger.LogInformation("Fetching appointment with ID: {Id}", id);
            var entity = await _repo.GetAppointmentByIdAsync(id);
            if (entity == null)
            {
                _logger.LogWarning("Appointment with ID {Id} not found.", id);
                return null;
            }
            return _mapper.Map<AppointmentResponseModel>(entity);
        }

        public async Task<int> CreateAppointmentAsync(BookAppointmentRequestModel model, string createdBy)
        {
            _logger.LogInformation("Attempting to create appointment for PatientId: {PatientId}, DoctorId: {DoctorId}", model.PatientId, model.DoctorId);

            var patient = await _prepo.GetPatientByIdAsync(model.PatientId);
            if (patient == null)
            {
                _logger.LogWarning("PatientId {PatientId} not found while creating appointment.", model.PatientId);
                throw new ArgumentException($"PatientId {model.PatientId} not found");
            }

            var doctor = await _drepo.GetDoctorByIdAsync(model.DoctorId);
            if (doctor == null)
            {
                _logger.LogWarning("DoctorId {DoctorId} not found while creating appointment.", model.DoctorId);
                throw new ArgumentException($"DoctorId {model.DoctorId} not found");
            }

            var appointment = _mapper.Map<Appointments>(model);
            appointment.CreatedBy = createdBy;
            appointment.CreatedDate = DateTime.UtcNow;
            appointment.Status = "Scheduled";

            var newId = await _repo.AddAppointmentAsync(appointment);
            _logger.LogInformation("Appointment created successfully with ID: {AppointmentId}", newId);

            return newId;
        }

        public async Task<int> PatchAppointmentAsync(int id, PatchAppointmentRequest model, string updatedBy)
        {
            _logger.LogInformation("Attempting to patch appointment with ID: {Id}", id);
            var entity = await _repo.GetAppointmentByIdAsync(id);
            if (entity == null)
            {
                _logger.LogWarning("Appointment with ID {Id} not found for patching.", id);
                throw new KeyNotFoundException($"Appointment {id} not found");
            }

            if (!string.IsNullOrWhiteSpace(model.Status))
                entity.Status = model.Status;
            if (model.AppointmentDate.HasValue)
                entity.AppointmentDate = model.AppointmentDate.Value;

            entity.UpdatedBy = updatedBy;
            entity.UpdatedDate = DateTime.UtcNow;

            var result = await _repo.UpdateAppointmentAsync(entity);
            _logger.LogInformation("Appointment with ID {Id} patched successfully.", id);

            return result;
        }

        public async Task<int> DeleteAppointmentAsync(int id)
        {
            _logger.LogInformation("Attempting to delete appointment with ID: {Id}", id);
            var exists = await _repo.GetAppointmentByIdAsync(id);
            if (exists == null)
            {
                _logger.LogWarning("Appointment with ID {Id} not found for deletion.", id);
                throw new KeyNotFoundException($"Appointment {id} not found");
            }

            var result = await _repo.DeleteAppointmentAsync(id);
            _logger.LogInformation("Appointment with ID {Id} deleted successfully.", id);

            return result;
        }
    }
}
