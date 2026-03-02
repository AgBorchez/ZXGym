using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymManager.api.Models
{
    public class Socio
    {
        [Key]
        public int DNI { get; set; }
        public string Name { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [MaxLength(20)]
        public string Phone { get; set; } = string.Empty;
        public DateTime JoinDate { get; set; } 

        public DateTime EndDate { get; set; }

        public int PlanId { get; set; }
    }
}
