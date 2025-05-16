
namespace HospitalManagementSystem.DAL.Entities
{
    public class Roles
    {
        public int RoleId { get; set; } 
        public string RoleName { get; set; } = string.Empty;

        public ICollection<UserRoles> UserRoles { get; set; } = new List<UserRoles>();

    }
}
