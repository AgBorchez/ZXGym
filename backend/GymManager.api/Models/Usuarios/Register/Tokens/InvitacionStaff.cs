namespace GymManager.api.Models.Usuarios.Register.Tokens
{
    public class InvitacionStaff
    {
        public int Id { get; set; }

        public string Codigo { get; set; } = string.Empty;

        public string Rol { get; set; } = string.Empty; 

        public bool Usado { get; set; } = false;

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    }
}
