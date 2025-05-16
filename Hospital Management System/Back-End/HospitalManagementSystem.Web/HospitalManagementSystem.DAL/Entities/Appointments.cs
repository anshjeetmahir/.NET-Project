

namespace HospitalManagementSystem.DAL.Entities
{
    public class Appointments
    {
        public int AppointmentId { get; set; }

        public int PatientId { get; set; }
        public int DoctorId { get; set; }

        public DateTime AppointmentDate { get; set; } 
        public string? Purpose { get; set; } 
        public string Status { get; set; } = string.Empty;

        public string CreatedBy { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public string? UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;

        public virtual Patients Patient { get; set; } = default!;
        public virtual Doctors Doctor { get; set; } = default!;
    }

}
