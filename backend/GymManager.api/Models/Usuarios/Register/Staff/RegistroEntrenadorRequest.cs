using GymManager.api.Models.Entrenadores;
using System.ComponentModel.DataAnnotations;

namespace GymManager.api.Models.Usuarios.Register.Staff
{
    public class RegistroEntrenadorRequest : EntrenadorCreateDTO
    {
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "El token de invitación es obligatorio")]
        public string Token { get; set; } = string.Empty;
    }
}
