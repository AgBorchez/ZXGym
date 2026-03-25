using System.ComponentModel.DataAnnotations;

namespace GymManager.api.Models.Entrenadores
{
    public class EntrenadorResponseDTO
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int DNI { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Phone { get; set; } = string.Empty;

        [Required]
        public string Specialty { get; set; } = string.Empty;

        [Required]
        public string Shift { get; set; } = string.Empty;

        public DateTime JoinDate { get; set; }

        public DateTime RCPExpirationDate { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
