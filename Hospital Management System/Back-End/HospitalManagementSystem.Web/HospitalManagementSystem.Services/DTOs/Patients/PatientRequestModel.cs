namespace HospitalManagementSystem.BLL.DTOs.Patients
{
    public class PatientRequestModel
    {
        public string FirstName { get; set; } = string.Empty;
        public string? LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string? Email { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Address { get; set; }

        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        public IEnumerable<string> Roles { get; set; } = new[] { "Patient" };
    }
}
