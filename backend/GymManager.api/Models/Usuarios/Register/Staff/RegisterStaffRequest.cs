using System.ComponentModel.DataAnnotations;

namespace GymManager.api.Models.Usuarios.Register.Staff
{
    public class RegisterStaffRequest
    {
        [Required(ErrorMessage = "El DNI es obligatorio")]
        public int DNI { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(100)]
        public string LastName { get; set; }

        [Required]
        [EmailAddress(ErrorMessage = "Formato de email incorrecto")]
        public string Email { get; set; }

        [Required]
        public string Type { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres")]
        public string Password { get; set; }

        [Required(ErrorMessage = "El token de invitación es necesario")]
        public string Token { get; set; }
    }
}
