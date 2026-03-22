namespace GymManager.api.Models.Usuarios.Login
{
    public class LoginRequestOriginal //le agregue original porque sino hacia colosion con loginrequest de aspnet
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
