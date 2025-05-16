
using AutoMapper;
using HospitalManagementSystem.BLL.DTOs.Appointments;
using HospitalManagementSystem.DAL.Entities;

namespace HospitalManagementSystem.BLL.Mappers
{
    public class AppointmentMappingProfile : Profile
    {
        public AppointmentMappingProfile()
        {
            CreateMap<BookAppointmentRequestModel, Appointments>();
         
           
            CreateMap<PatchAppointmentRequest, Appointments>()
                .ForAllMembers(opts => opts.Condition((src, dest, v) => v != null));

            CreateMap<Appointments, AppointmentResponseModel>()
                .ForMember(r => r.PatientName, o => o.MapFrom(src => src.Patient.FirstName + " " + src.Patient.LastName))
                .ForMember(r => r.DoctorName, o => o.MapFrom(src => src.Doctor.FirstName + " " + src.Doctor.LastName))
                .ForMember(r => r.AppointmentId, o => o.MapFrom(src => src.AppointmentId));
        }
    }

}