using HospitalManagementSystem.BLL.DTOs.Api;
using HospitalManagementSystem.BLL.DTOs.Appointments;
using HospitalManagementSystem.BLL.Interfaces.ServiceInterfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HospitalManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _service;
        private readonly ILogger<AppointmentsController> _logger;

        public AppointmentsController(IAppointmentService service, ILogger<AppointmentsController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAppointments()
        {
            _logger.LogInformation("Fetching all appointments...");
            var list = await _service.GetAllAppointmentsAsync();
            var message = list.Any() ? "Appointments retrieved successfully." : "No appointments found.";
            _logger.LogInformation("Appointments retrieved: {Count}", list.Count());

            return Ok(new ApiResponse
            {
                Message = message,
                Data = list
            });
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetAppointmentById(int id)
        {
            _logger.LogInformation("Fetching appointment by ID: {Id}", id);
            var appt = await _service.GetAppointmentByIdAsync(id);
            if (appt == null)
            {
                _logger.LogWarning("Appointment ID {Id} not found.", id);
                return NotFound(new { error = $"Appointment {id} not found." });
            }

            return Ok(appt);
        }

        [HttpPost("add")]
        public async Task<IActionResult> CreateAppointment([FromBody] BookAppointmentRequestModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var createdBy = User.Identity?.Name ?? "system";
                _logger.LogInformation("Creating appointment by: {User}", createdBy);
                var newId = await _service.CreateAppointmentAsync(model, createdBy);
                _logger.LogInformation("Appointment created successfully with ID: {Id}", newId);

                return CreatedAtAction(nameof(GetAppointmentById), new { id = newId }, new ApiResponse
                {
                    Message = "Appointment created successfully.",
                    Data = new { appointmentId = newId }
                });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Validation error creating appointment: {Message}", ex.Message);
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error creating appointment.");
                return StatusCode(500, new { error = "An unexpected error occurred." });
            }
        }

        [HttpPatch("update/{id:int}")]
        public async Task<IActionResult> PatchAppointment(int id, [FromBody] PatchAppointmentRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var updatedBy = User.Identity?.Name ?? "system";
                _logger.LogInformation("Updating appointment ID: {Id} by user {User}", id, updatedBy);
                var result = await _service.PatchAppointmentAsync(id, model, updatedBy);

                if (result > 0)
                {
                    _logger.LogInformation("Appointment ID {Id} updated successfully.", id);
                    return Ok(new ApiResponse
                    {
                        Message = $"Appointment with ID {id} updated successfully.",
                        Data = new { id }
                    });
                }

                _logger.LogWarning("Appointment ID {Id} not found.", id);
                return NotFound(new { error = $"Doctor with ID {id} not found." });
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Appointment not found: {Message}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error updating appointment.");
                return StatusCode(500, new { error = "An unexpected error occurred." });
            }
        }

        [HttpDelete("delete/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            try
            {
                _logger.LogInformation("Deleting appointment ID: {Id}", id);
                await _service.DeleteAppointmentAsync(id);
                _logger.LogInformation("Appointment ID {Id} deleted successfully.", id);

                return Ok(new ApiResponse
                {
                    Message = $"Appointment with ID {id} deleted successfully."
                });
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Appointment not found for deletion: {Message}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error deleting appointment.");
                return StatusCode(500, new { error = "An unexpected error occurred." });
            }
        }
    }
}
