
using AutoMapper;
using HospitalManagementSystem.BLL.DTOs.Doctors;
using HospitalManagementSystem.DAL.Entities;

namespace HospitalManagementSystem.BLL.Mappers
{
    public class DoctorMappingProfile : Profile
    {
        public DoctorMappingProfile()
        {
            CreateMap<DoctorRequestModel, Users>();
            CreateMap<DoctorRequestModel, Doctors>();
            CreateMap<Doctors, DoctorResponseModel>()
            .ForMember(d => d.userName, o => o.MapFrom(src => src.User.UserName))
            .ForMember(d => d.DoctorId, o => o.MapFrom(src => src.DoctorId));
        }
    }
}
