using FluentValidation.AspNetCore;
using FluentValidation;
using HospitalManagementSystem.BLL.Interfaces.RepositoryInterfaces;
using HospitalManagementSystem.BLL.Interfaces.ServiceInterfaces;
using HospitalManagementSystem.BLL.Mappers;
using HospitalManagementSystem.BLL.Services;
using HospitalManagementSystem.DAL.DBContext;
using HospitalManagementSystem.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using HospitalManagementSystem.Infrastructure.Validators;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using HospitalManagementSystem.DAL.Entities;
using Microsoft.AspNetCore.Identity;
using Serilog;


var builder = WebApplication.CreateBuilder(args);


Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)      
    .CreateLogger();

builder.Host
    .UseSerilog();

builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<IDoctorRepository, DoctorRepository>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserRoleRepository, UserRoleRepository>();
builder.Services.AddScoped<IPasswordHasher<Users>, PasswordHasher<Users>>();



builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IDoctorService, DoctorService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped< LoginService >();
builder.Services.AddScoped<IAdminService, AdminService>();


builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddValidatorsFromAssemblyContaining<PatientRequestValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<DoctorRequestValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<BookAppointmentRequestValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<PatchAppointmentRequestValidator>();


builder.Services.AddFluentValidationAutoValidation();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
 options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAutoMapper(
    typeof(PatientMappingProfile),
    typeof(DoctorMappingProfile),
    typeof(AppointmentMappingProfile)
);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
 .AddJwtBearer(options =>
 {
     options.TokenValidationParameters = new TokenValidationParameters
     {
         ValidateIssuer = true,
         ValidateAudience = true,
         ValidateLifetime = true,
         ValidateIssuerSigningKey = true,

         ValidIssuer = builder.Configuration["Jwt:Issuer"],
         ValidAudience = builder.Configuration["Jwt:Audience"],
         IssuerSigningKey = new SymmetricSecurityKey(
             Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
         )
     };
 });

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "My API",
        Version = "v1"
    });


    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid token.\nExample: \"Bearer eyJhbGciOi...\""
    });


    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowAnyHeader();
    });
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("DevCors");

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

try
{
    Log.Information("Starting web host");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Host terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();  
}
