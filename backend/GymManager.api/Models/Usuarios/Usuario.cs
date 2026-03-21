using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymManager.api.Models.Usuarios
{
    public class Usuario
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int DNI { get; set; } // Campo base para el vínculo futuro

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(100)]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Type { get; set; }

        // El '?' es vital: permite que los socios migrados 
        // no tengan clave hasta que la seteen por primera vez
        public string? Password { get; set; }
    }
}