using System.ComponentModel.DataAnnotations;

namespace GymManager.api.Models.Socios
{
    public class SocioResponseDTO
    {
        public int Id { get; set; }
        public int DNI { get; set; }
        public string Name { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;
        public DateTime JoinDate { get; set; }

        public DateTime EndDate { get; set; }

        public int PlanId { get; set; }

        public List<string>? Patologias { get; set; }
    }
}
