using FluentValidation;
using HospitalManagementSystem.BLL.DTOs.Patients;

namespace HospitalManagementSystem.Infrastructure.Validators
{
    public class PatientRequestValidator : AbstractValidator<PatientRequestModel>
    {
        public PatientRequestValidator()
        {
            RuleFor(patient => patient.FirstName)
             .NotEmpty().WithMessage("Patient's FirstName cannot be empty.")
             .Matches(@"^[^\d]+$").WithMessage("Patient's FirstName should not contain numbers.")
             .MinimumLength(3).WithMessage("Patient's FirstName must be at least 3 characters.")
             .MaximumLength(20).WithMessage("Patient's FirstName must not exceed 20 characters.");

            RuleFor(patient => patient.LastName)
                .MinimumLength(3).WithMessage("Patient's LastName must be at least 3 characters.")
                .Matches(@"^[^\d]+$").WithMessage("Patient's LastName should not contain numbers.")
                .MaximumLength(20).WithMessage("Patient's LastName must not exceed 20 characters.")
                .When(patient => !string.IsNullOrWhiteSpace(patient.LastName));

            RuleFor(patient => patient.DateOfBirth)
                .NotEmpty().WithMessage("Date of Birth is required.")
                .LessThan(DateTime.Today).WithMessage("Date of Birth must be in the past.");

            RuleFor(patient => patient.Email)
                .EmailAddress().WithMessage("Email must be a valid email address with @.")
                .MinimumLength(5).WithMessage("Patient Email must be at least 5 characters long.")
                .MaximumLength(100).WithMessage("Patient Email must not exceed 100 characters.")
                .When(patient => !string.IsNullOrWhiteSpace(patient.Email));

            RuleFor(patient => patient.PhoneNumber)
                .NotEmpty().WithMessage("Phone number is required.")
                .Matches("^[0-9]{10}$").WithMessage("Phone number must be 10 digits.");

            RuleFor(patient => patient.Address)
                .MaximumLength(200).WithMessage("Patient's Address must not exceed 200 characters.");

            RuleFor(x => x.UserName)
                .NotEmpty().WithMessage("Username is required.")
                .MinimumLength(4).WithMessage("Username must be at least 4 characters.")
                .MaximumLength(50).WithMessage("Username must not exceed 50 characters.");

            RuleFor(patient => patient.Password)
                .NotEmpty().WithMessage("Password is required.")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters.")
                .MaximumLength(100).WithMessage("Password must not exceed 100 characters.")
                .Matches(@"[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
                .Matches(@"[a-z]").WithMessage("Password must contain at least one lowercase letter.")
                .Matches(@"\d").WithMessage("Password must contain at least one digit.");

            
        }
    }
}
