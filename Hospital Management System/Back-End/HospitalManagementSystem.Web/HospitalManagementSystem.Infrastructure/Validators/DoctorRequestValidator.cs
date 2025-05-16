using FluentValidation;
using HospitalManagementSystem.BLL.DTOs.Doctors;

namespace HospitalManagementSystem.Infrastructure.Validators
{
    public class DoctorRequestValidator : AbstractValidator<DoctorRequestModel>
    {
        public DoctorRequestValidator()
        {
            RuleFor(doc => doc.FirstName)
               .NotEmpty().WithMessage("Doctor's First Name is required.")
               .Matches(@"^[^\d]+$").WithMessage("First Name should not contain numbers.")
               .MinimumLength(3).WithMessage("First Name must be at least 3 characters.")
               .MaximumLength(20).WithMessage("First Name must not exceed 20 characters.");

            RuleFor(doc => doc.LastName)
                .MinimumLength(3).WithMessage("Last Name must be at least 3 characters.")
                .Matches(@"^[^\d]+$").WithMessage("Last Name should not contain numbers.")
                .MaximumLength(20).WithMessage("Last Name must not exceed 20 characters.")
                .When(doc => !string.IsNullOrWhiteSpace(doc.LastName));

            RuleFor(doc => doc.Specialization)
                .NotEmpty().WithMessage("Specialization is required.")
                .MinimumLength(3).WithMessage("Specialization must be at least 3 characters.")
                .MaximumLength(50).WithMessage("Specialization must not exceed 50 characters.");

            RuleFor(doc => doc.YearsOfExperience)
                .GreaterThanOrEqualTo(0).WithMessage("Years of Experience must be 0 or more.")
                .LessThanOrEqualTo(60).WithMessage("Years of Experience must be realistic (<= 60).");

            RuleFor(doc => doc.Email)
                .EmailAddress().WithMessage("Email must be valid.")
                .MinimumLength(5).WithMessage("Email must be at least 5 characters.")
                .MaximumLength(100).WithMessage("Email must not exceed 100 characters.")
                .When(doc => !string.IsNullOrWhiteSpace(doc.Email));

            RuleFor(x => x.UserName)
               .NotEmpty().WithMessage("Username is required.")
               .MinimumLength(4).WithMessage("Username must be at least 4 characters.")
               .MaximumLength(50).WithMessage("Username must not exceed 50 characters.");

            RuleFor(doc => doc.Password)
                .NotEmpty().WithMessage("Password is required.")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters.")
                .MaximumLength(100).WithMessage("Password must not exceed 100 characters.")
                .Matches(@"[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
                .Matches(@"[a-z]").WithMessage("Password must contain at least one lowercase letter.")
                .Matches(@"\d").WithMessage("Password must contain at least one digit.");

            
        }
    }
}
