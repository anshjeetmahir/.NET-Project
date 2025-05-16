namespace HospitalManagementSystem.BLL.DTOs.Appointments
{
    public class AppointmentResponseModel
    {
        public int AppointmentId { get; set; }

        public int PatientId { get; set; }

        public int DoctorId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string DoctorName { get; set; } = string.Empty;
        public DateTime AppointmentDate { get; set; }
        public string? Purpose { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
