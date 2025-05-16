namespace HospitalManagementSystem.BLL.DTOs.Api
{
    public class ApiResponse
    {
        public string Message { get; set; } = string.Empty;
        public object? Data { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
