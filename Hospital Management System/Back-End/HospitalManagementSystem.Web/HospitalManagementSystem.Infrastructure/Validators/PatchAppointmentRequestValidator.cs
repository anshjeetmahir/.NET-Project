
using FluentValidation;
using HospitalManagementSystem.BLL.DTOs.Appointments;

namespace HospitalManagementSystem.Infrastructure.Validators
{
    public class PatchAppointmentRequestValidator : AbstractValidator<PatchAppointmentRequest>
    {
        public PatchAppointmentRequestValidator()
        {
            RuleFor(x => x.Status)
                .Must(status => new[] { "Scheduled","Re-Schedule", "Completed", "Cancelled" }.Contains(status!))
                .WithMessage("Status must be 'Scheduled', 'Completed', or 'Cancelled'.")
                .When(x => !string.IsNullOrWhiteSpace(x.Status));

            RuleFor(x => x.AppointmentDate)
                .GreaterThan(DateTime.Now)
                .WithMessage("Appointment date must be in the future.")
                .When(x => x.AppointmentDate.HasValue);
        }
    }
}
