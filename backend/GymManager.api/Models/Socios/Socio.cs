using GymManager.api.Models.Usuarios;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymManager.api.Models.Socios
{
    public class Socio
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int DNI { get; set; }

        [ForeignKey("DNI")]

        public virtual Usuario? Usuario { get; set; }
        public string Name { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [MaxLength(20)]
        public string Phone { get; set; } = string.Empty;
        public DateTime JoinDate { get; set; } 

        public DateTime EndDate { get; set; }

        public int PlanId { get; set; }

        public int? EntrenadorId { get; set; } // Lo ponemos nulable por si un socio aún no tiene asignado uno

        [ForeignKey("EntrenadorId")]
        public virtual Usuario? Entrenador { get; set; }
    }
}
