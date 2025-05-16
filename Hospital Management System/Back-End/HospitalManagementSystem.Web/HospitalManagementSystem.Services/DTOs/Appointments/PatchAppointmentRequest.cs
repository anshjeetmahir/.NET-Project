namespace HospitalManagementSystem.BLL.DTOs.Appointments
{
    public class PatchAppointmentRequest
    {
        public string? Status { get; set; }
        public DateTime? AppointmentDate { get; set; }
    }
}
