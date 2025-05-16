using HospitalManagementSystem.BLL.Interfaces.ServiceInterfaces;
using HospitalManagementSystem.BLL.DTOs.Patients;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HospitalManagementSystem.BLL.DTOs.Api;

namespace HospitalManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PatientsController : ControllerBase
    {
        private readonly IPatientService _service;
        private readonly ILogger<PatientsController> _logger;

        public PatientsController(IPatientService service, ILogger<PatientsController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPatients()
        {
            _logger.LogInformation("Fetching all patients...");
            var list = await _service.GetAllPatientsAsync();
            var message = list.Any() ? "Patients retrieved successfully." : "No patients found.";
            _logger.LogInformation("Patients retrieved: {Count}", list.Count());

            return Ok(new ApiResponse
            {
                Message = message,
                Data = list
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPatientById(int id)
        {
            try
            {
                _logger.LogInformation("Fetching patient by ID: {Id}", id);
                var patient = await _service.GetPatientByIdAsync(id);
                if (patient == null)
                {
                    _logger.LogWarning("Patient ID {Id} not found.", id);
                    return NotFound(new { error = $"Patient {id} not found." });
                }

                return Ok(patient);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error fetching patient ID: {Id}", id);
                return StatusCode(500, new { error = "Unexpected error occurred while fetching patient." });
            }
        }

        [HttpPost("add")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreatePatient([FromBody] PatientRequestModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var createdBy = User.Identity?.Name ?? "system";
                _logger.LogInformation("Creating new patient by user: {User}", createdBy);
                var newId = await _service.CreatePatientAsync(model, createdBy);
                _logger.LogInformation("Patient created with ID: {Id}", newId);

                return CreatedAtAction(nameof(GetPatientById), new { id = newId }, new ApiResponse
                {
                    Message = "Patient created successfully.",
                    Data = new { patientId = newId }
                });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Business validation error while creating patient.");
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error creating patient.");
                return StatusCode(500, new { error = "An unexpected error occurred." });
            }
        }

        [HttpPut("update/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] PatientRequestModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var updatedBy = User.Identity?.Name ?? "system";
                _logger.LogInformation("Updating patient ID: {Id} by user {User}", id, updatedBy);
                var result = await _service.UpdatePatientAsync(id, model, updatedBy);

                if (result > 0)
                {
                    _logger.LogInformation("Patient ID {Id} updated successfully.", id);
                    return Ok(new ApiResponse
                    {
                        Message = $"Patient with ID {id} updated successfully.",
                        Data = new { id }
                    });
                }

                _logger.LogWarning("Patient ID {Id} not found for update.", id);
                return NotFound(new { error = $"Patient with ID {id} not found." });
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Patient not found: {Message}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error updating patient.");
                return StatusCode(500, new { error = "An unexpected error occurred." });
            }
        }

        [HttpDelete("delete/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            try
            {
                _logger.LogInformation("Deleting patient ID: {Id}", id);
                await _service.DeletePatientAsync(id);
                _logger.LogInformation("Patient ID {Id} deleted successfully.", id);

                return Ok(new ApiResponse
                {
                    Message = $"Patient with ID {id} deleted successfully."
                });
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Patient not found for deletion: {Message}", ex.Message);
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error deleting patient.");
                return StatusCode(500, new { error = "An unexpected error occurred." });
            }
        }
    }
}
