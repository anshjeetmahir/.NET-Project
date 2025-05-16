
using AutoMapper;
using HospitalManagementSystem.BLL.DTOs.Patients;
using HospitalManagementSystem.DAL.Entities;

namespace HospitalManagementSystem.BLL.Mappers
{
    public class PatientMappingProfile : Profile
    {
        public PatientMappingProfile()
        {
            CreateMap<PatientRequestModel, Users>();
            CreateMap<PatientRequestModel, Patients>();
            CreateMap<Patients, PatientResponseModel>()
            .ForMember(p => p.userName, o => o.MapFrom(src => src.User.UserName))
            .ForMember(p => p.PatientId, o => o.MapFrom(src => src.PatientId));
        }
    }
}
