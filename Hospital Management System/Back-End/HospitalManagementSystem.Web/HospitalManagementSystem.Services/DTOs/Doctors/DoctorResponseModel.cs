namespace HospitalManagementSystem.BLL.DTOs.Doctors
{
    public class DoctorResponseModel
    {
        public int DoctorId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string? LastName { get; set; }
        public string Specialization { get; set; } = string.Empty;
        public int YearsOfExperience { get; set; }
        public string? Email { get; set; }

        public string userName { get; set; }= string.Empty;

        public int userId { get; set; }
       
    }
}
