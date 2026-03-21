using GymManager.api.Models.Usuarios;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymManager.api.Models.Entrenadores
{
    public class Entrenador
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int DNI { get; set; }

        [Required]

        [ForeignKey("DNI")]

        public virtual Usuario? Usuario { get; set; }
        public string Name { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Phone { get; set; } = string.Empty;

        // Ej: Musculación, Crossfit, Pilates
        [Required]
        public string Specialty { get; set; } = string.Empty;

        // Ej: Mañana, Tarde, Noche
        [Required]
        public string Shift { get; set; } = string.Empty;

        public DateTime JoinDate { get; set; }

        // Vencimiento del curso de Primeros Auxilios / RCP
        public DateTime RCPExpirationDate { get; set; }

        // Para saber si sigue trabajando en el gym o ya se fue
        public bool IsActive { get; set; } = true;
    }
}
