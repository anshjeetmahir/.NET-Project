

namespace HospitalManagementSystem.DAL.Entities
{
    public class UserRoles
    {
        public int UserId { get; set; }
        public Users User { get; set; } = default!;

        public int RoleId { get; set; }
        public Roles Role { get; set; } = default!;
    }
}
