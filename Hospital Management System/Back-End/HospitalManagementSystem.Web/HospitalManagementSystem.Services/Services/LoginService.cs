using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HospitalManagementSystem.BLL.DTOs.Login;
using HospitalManagementSystem.BLL.Interfaces.RepositoryInterfaces;
using HospitalManagementSystem.BLL.Interfaces.ServiceInterfaces;
using HospitalManagementSystem.DAL.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Logging;

namespace HospitalManagementSystem.BLL.Services
{
    public class LoginService : ILoginService
    {
        private readonly IUserRepository _userRepo;
        private readonly IUserRoleRepository _userRoleRepo;
        private readonly IPasswordHasher<Users> _passwordHasher;
        private readonly IConfiguration _config;
        private readonly ILogger<LoginService> _logger;

        public LoginService(IUserRepository userRepo, IUserRoleRepository userRoleRepo,
        IPasswordHasher<Users> passwordHasher, IConfiguration config, ILogger<LoginService> logger)
        {
            _userRepo = userRepo;
            _userRoleRepo = userRoleRepo;
            _passwordHasher = passwordHasher;
            _config = config;
            _logger = logger; 
        }

        public async Task<LoginResponseModel> LoginServiceAsync(LoginRequestModel request)
        {
            _logger.LogInformation("Login attempt for username: {UserName}", request.UserName);

            var user = await _userRepo.GetUserByUsernameAsync(request.UserName);

            if (user == null)
            {
                _logger.LogWarning("Login failed. Invalid username: {UserName}", request.UserName);
                throw new UnauthorizedAccessException("Invalid username or password");
            }

            var result = _passwordHasher.VerifyHashedPassword(user, user.Password, request.Password);
            if (result != PasswordVerificationResult.Success)
            {
                _logger.LogWarning("Login failed. Invalid password for username: {UserName}", request.UserName);
                throw new UnauthorizedAccessException("Invalid username or password");
            }

            _logger.LogInformation("User {UserName} successfully authenticated.", request.UserName);

            var roles = await _userRoleRepo.GetRolesForUserAsync(user.UserId);

            var claims = new List<Claim>
            {
                new Claim("UserId", user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
            };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var minutes = int.Parse(_config["Jwt:ExpiryMinutes"]!);
            var expires = DateTime.UtcNow.AddMinutes(minutes);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: expires,
                signingCredentials: creds);

            _logger.LogInformation("Token created successfully for user {UserName}. Expires at {ExpiresAt}", request.UserName, expires);

            return new LoginResponseModel
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                ExpiresAt = expires
            };
        }
    }
}
