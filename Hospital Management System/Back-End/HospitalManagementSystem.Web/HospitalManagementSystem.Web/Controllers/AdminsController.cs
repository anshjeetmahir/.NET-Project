using HospitalManagementSystem.BLL.DTOs.Admin;
using HospitalManagementSystem.BLL.DTOs.Api;
using HospitalManagementSystem.BLL.Interfaces.ServiceInterfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HospitalManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AdminsController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly ILogger<AdminsController> _logger;

        public AdminsController(IAdminService adminService, ILogger<AdminsController> logger)
        {
            _adminService = adminService;
            _logger = logger;
        }

        [HttpPost("add")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateAdmin([FromBody] AdminRequestModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                _logger.LogInformation("Creating a new admin user...");
                var created = await _adminService.CreateAdminAsync(model);
                _logger.LogInformation("Admin user created successfully.");
                return CreatedAtAction(null, new ApiResponse
                {
                    Message = "Admin user created successfully.",
                    Data = created
                });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Failed to create admin user: {Message}", ex.Message);
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error occurred while creating admin user.");
                return StatusCode(500, new { error = "Unexpected error creating admin." });
            }
        }
    }
}
