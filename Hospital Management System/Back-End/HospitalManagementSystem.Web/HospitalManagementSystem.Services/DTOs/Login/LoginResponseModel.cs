namespace HospitalManagementSystem.BLL.DTOs.Login
{
    public class LoginResponseModel
    {
        public string Token { get; set; } = "";
        public DateTime ExpiresAt { get; set; }
    }
}
