using GymManager.api.Data;
using Microsoft.EntityFrameworkCore;

namespace GymManager.api.Models.Usuarios
{
    public interface IUsuarioService
    {
        Task<Usuario> CrearUsuarioBaseAsync(int dni, string name, string lastName, string email, string password, string type);
    }
    public class UsuarioService : IUsuarioService
    {
        private readonly DataContext _context;

        public UsuarioService(DataContext context) => _context = context;

        public async Task<Usuario> CrearUsuarioBaseAsync(int dni, string name, string lastName, string email, string password, string type)
        {
            // Validación centralizada de duplicados
            if (await _context.Usuarios.AnyAsync(u => u.Email == email || u.DNI == dni))
                throw new Exception("El Email o DNI ya existen en el sistema.");

            var usuario = new Usuario
            {
                DNI = dni,
                Name = name,
                LastName = lastName,
                Email = email,
                Type = type,
                
            };

            if (!string.IsNullOrWhiteSpace(password))
            {
                usuario.Password = BCrypt.Net.BCrypt.HashPassword(password);
            }
            else
            {
                usuario.Password = null; // O string.Empty, según prefieras
            }

            return usuario;
        }
    }
}
