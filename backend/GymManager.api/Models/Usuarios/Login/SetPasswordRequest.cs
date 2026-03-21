namespace GymManager.api.Models.Usuarios.Login
{
    public class SetPasswordRequest
    {
        public int DNI { get; set; }
        public string Password { get; set; } = string.Empty;
    }
}
