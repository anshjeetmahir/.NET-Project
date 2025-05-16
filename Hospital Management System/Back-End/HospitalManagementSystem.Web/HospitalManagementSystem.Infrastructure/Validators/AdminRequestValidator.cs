
using FluentValidation;
using HospitalManagementSystem.BLL.DTOs.Admin;
using HospitalManagementSystem.BLL.Interfaces.RepositoryInterfaces;

namespace HospitalManagementSystem.Infrastructure.Validators
{
    public class AdminRequestValidator : AbstractValidator<AdminRequestModel>
    {
        public AdminRequestValidator(IUserRepository userRepo)
        {
            RuleFor(x => x.UserName)
                .NotEmpty().WithMessage("Username is required.")
                .MinimumLength(4).WithMessage("Username must be at least 4 characters.")
                .MaximumLength(50).WithMessage("Username must not exceed 50 characters.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required.")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters.");

        }
    }

}
