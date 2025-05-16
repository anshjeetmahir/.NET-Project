namespace HospitalManagementSystem.BLL.DTOs.Appointments
{
    public class BookAppointmentRequestModel
    {
      
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string? Purpose { get; set; }
   
    }
}
