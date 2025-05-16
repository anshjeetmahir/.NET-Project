namespace HospitalManagementSystem.BLL.DTOs.Patients
{
    public class PatientResponseModel
    {
        public int PatientId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string? LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string? Email { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Address { get; set; }

        public string userName { get; set; } = string.Empty;

        public int userId { get; set; }
    }
}
