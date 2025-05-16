using HospitalManagementSystem.BLL.DTOs.Api;
using HospitalManagementSystem.BLL.DTOs.Doctors;
using HospitalManagementSystem.BLL.Interfaces.ServiceInterfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HospitalManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DoctorsController : ControllerBase
    {
        private readonly IDoctorService _service;
        private readonly ILogger<DoctorsController> _logger;

        public DoctorsController(IDoctorService service, ILogger<DoctorsController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllDoctors()
        {
            _logger.LogInformation("Fetching all doctors...");
            var list = await _service.GetAllDoctorsAsync();
            var message = list.Any() ? "Doctors retrieved successfully." : "No doctors found.";
            _logger.LogInformation("Doctors retrieved: {Count}", list.Count());

            return Ok(new ApiResponse { Message = message, Data = list });
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetDoctorById(int id)
        {
            _logger.LogInformation("Fetching doctor by ID: {Id}", id);
            var doctor = await _service.GetDoctorByIdAsync(id);
            if (doctor == null)
            {
                _logger.LogWarning("Doctor ID {Id} not found.", id);
                return NotFound(new { error = $"Doctor {id} not found." });
            }

            return Ok(doctor);
        }

        [HttpPost("add")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateDoctor([FromBody] DoctorRequestModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var createdBy = User.Identity?.Name ?? "system";
                _logger.LogInformation("Creating doctor by user: {User}", createdBy);
                var newId = await _service.CreateDoctorAsync(model, createdBy);
                _logger.LogInformation("Doctor created with ID: {Id}", newId);

                return CreatedAtAction(nameof(GetDoctorById), new { id = newId }, new ApiResponse
                {
                    Message = "Doctor created successfully.",
                    Data = new { doctorId = newId }
                });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Business rule violation while creating doctor.");
                return BadRequest(ex.Message);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Validation error: {Message}", ex.Message);
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error occurred while creating doctor.");
                return StatusCode(500, new { error = "An unexpected error occurred." });
            }
        }

        [HttpPut("update/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateDoctor(int id, [FromBody] DoctorRequestModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var updatedBy = User.Identity?.Name ?? "system";
                _logger.LogInformation("Updating doctor ID: {Id} by user {User}", id, updatedBy);
                var result = await _service.UpdateDoctorAsync(id, model, updatedBy);

                if (result > 0)
                {
                    _logger.LogInformation("Doctor ID {Id} updated successfully.", id);
                    return Ok(new ApiResponse
                    {
                        Message = $"Doctor with ID {id} updated successfully.",
                        Data = new { id }
                    });
                }

                _logger.LogWarning("Doctor ID {Id} not found for update.", id);
                return NotFound(new { error = $"Doctor with ID {id} not found." });
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Doctor not found: {Message}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Validation failed during update: {Message}", ex.Message);
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error updating doctor.");
                return StatusCode(500, new { error = "An unexpected error occurred." });
            }
        }

        [HttpDelete("delete/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            try
            {
                _logger.LogInformation("Deleting doctor ID: {Id}", id);
                await _service.DeleteDoctorAsync(id);
                _logger.LogInformation("Doctor ID {Id} deleted successfully.", id);

                return Ok(new ApiResponse
                {
                    Message = $"Doctor with ID {id} deleted successfully."
                });
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Doctor not found for deletion: {Message}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error deleting doctor.");
                return StatusCode(500, new { error = "An unexpected error occurred." });
            }
        }
    }
}
