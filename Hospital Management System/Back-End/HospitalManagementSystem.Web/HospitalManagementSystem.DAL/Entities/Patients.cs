namespace HospitalManagementSystem.DAL.Entities
{
    public class Patients
    {
        public int PatientId { get; set; }

        public string FirstName { get; set; } = string.Empty;
        public string? LastName { get; set; }
        public DateTime DateOfBirth { get; set; }

        public string? Email { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Address { get; set; }

        public string CreatedBy { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; } = DateTime.UtcNow;

        public int UserId { get; set; }

        public virtual ICollection<Appointments> Appointments { get; set; } = new List<Appointments>();

        public Users User { get; set; } = default!;
    }

}
