using System.ComponentModel.DataAnnotations;

namespace GymManager.api.Models.Usuarios
{
    public class UsuarioResponseDTO
    {
        
        public int Id { get; set; }

        public int DNI { get; set; } // Campo base para el vínculo futuro

        public string Name { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string Type { get; set; }
    }
}
