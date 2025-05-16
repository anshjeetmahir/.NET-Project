

using FluentValidation;
using HospitalManagementSystem.BLL.DTOs.Appointments;

namespace HospitalManagementSystem.Infrastructure.Validators
{
    public class BookAppointmentRequestValidator : AbstractValidator<BookAppointmentRequestModel>
    {
        public BookAppointmentRequestValidator()
        {
            RuleFor(x => x.DoctorId)
                .GreaterThan(0).WithMessage("Doctor ID must be greater than 0.");
            
            RuleFor(x => x.PatientId)
                .GreaterThan(0).WithMessage("Patient ID must be greater than 0.");

            RuleFor(x => x.AppointmentDate)
                .GreaterThan(DateTime.Now).WithMessage("Appointment date must be in the future.");

            RuleFor(x => x.Purpose)
                .MaximumLength(200).WithMessage("Purpose must not exceed 200 characters.")
                .When(x => !string.IsNullOrWhiteSpace(x.Purpose));
        }
    }
}
