
using System.Data;
using System.Numerics;

namespace HospitalManagementSystem.DAL.Entities
{
    public class Users
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public virtual ICollection<UserRoles> UserRoles { get; set; } = new List<UserRoles>();

        public Doctors? Doctor { get; set; } 
        public Patients? Patient { get; set; } 
    }

}
