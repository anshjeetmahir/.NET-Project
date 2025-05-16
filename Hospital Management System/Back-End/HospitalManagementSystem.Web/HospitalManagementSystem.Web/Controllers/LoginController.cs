using HospitalManagementSystem.BLL.DTOs.Api;
using HospitalManagementSystem.BLL.DTOs.Login;
using HospitalManagementSystem.BLL.Services;
using Microsoft.AspNetCore.Mvc;

namespace HospitalManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly LoginService _loginService;
        private readonly ILogger<LoginController> _logger;

        public LoginController(LoginService loginService, ILogger<LoginController> logger)
        {
            _loginService = loginService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginRequestModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                _logger.LogInformation("Login attempt for user: {Username}", model.UserName);
                var response = await _loginService.LoginServiceAsync(model);
                _logger.LogInformation("Login successful for user: {Username}", model.UserName);

                return Ok(new ApiResponse
                {
                    Message = "Login successful.",
                    Data = response
                });
            }
            catch (UnauthorizedAccessException)
            {
                _logger.LogWarning("Unauthorized login attempt for user: {Username}", model.UserName);
                return Unauthorized(new { error = "Invalid username or password." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during login for user: {Username}", model.UserName);
                return StatusCode(500, new { error = "Internal server error during login." });
            }
        }
    }
}
