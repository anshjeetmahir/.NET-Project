namespace HospitalManagementSystem.BLL.DTOs.Doctors
{
    public class DoctorRequestModel
    {
        public string FirstName { get; set; } = string.Empty;
        public string? LastName { get; set; }
        public string Specialization { get; set; } = string.Empty;
        public int YearsOfExperience { get; set; }
        public string? Email { get; set; }

        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        public IEnumerable<string> Roles { get; set; } = new[] { "Doctor" };
    }
}
