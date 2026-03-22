using GymManager.api.Models.Entrenadores;

namespace GymManager.api.Models.Usuarios.Register
{
    public class RegistroEntrenadorRequest : EntrenadorCreateDTO
    {
        public string Password { get; set; } = string.Empty;
    }
}
