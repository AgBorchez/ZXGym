namespace GymManager.api.Models.Usuarios.Register.Tokens
{
    public class InvitacionStaff
    {
        public int Id { get; set; }

        // El código que viajará al Front (Ej: "TR-a1b2c3d4")
        public string Codigo { get; set; } = string.Empty;

        public string Rol { get; set; } = string.Empty; // "entrenador" o "manager"

        public bool Usado { get; set; } = false;

        // Fecha en la que se creó para saber cuándo debe morir
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    }
}
