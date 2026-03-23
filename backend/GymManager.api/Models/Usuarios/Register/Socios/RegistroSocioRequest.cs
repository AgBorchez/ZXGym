using GymManager.api.Models.Socios;

namespace GymManager.api.Models.Usuarios.Register.Socios
{
    public class RegistroSocioRequest : SocioCreateDTO
    {
        public string Password { get; set; } = string.Empty;
    }
}
