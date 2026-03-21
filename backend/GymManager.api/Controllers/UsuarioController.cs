using GymManager.api.Data;
using GymManager.api.Models;
using GymManager.api.Models.Usuarios;
using GymManager.api.Models.Usuarios.Login;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GymManager.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly DataContext _context;

        public UsuarioController(DataContext context)
        {
            _context = context;
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (usuario == null)
            {
                return Unauthorized(new { message = "Email o contraseña incorrectos" });
            }

            if (string.IsNullOrEmpty(usuario.Password))
            {
                return Ok(new
                {
                    status = "PENDING_PASSWORD",
                    message = "Debes configurar tu contraseña por primera vez",
                    dni = usuario.DNI
                });
            }

            if(!BCrypt.Net.BCrypt.Verify(request.Password, usuario.Password))
            {
                return Unauthorized(new { message = "Email o contraseña incorrectos" });
            }

            return Ok(new
            {
                id = usuario.Id,
                nombre = usuario.Name,
                tipo = usuario.Type, 
                dni = usuario.DNI
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Usuario nuevoUsuario)
        {
            if (await _context.Usuarios.AnyAsync(u => u.Email == nuevoUsuario.Email))
            {
                return BadRequest("El correo ya está registrado.");
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(nuevoUsuario.Password);
            nuevoUsuario.Password = passwordHash;

            // 3. Guardar en la DB de Render
            _context.Usuarios.Add(nuevoUsuario);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Usuario creado exitosamente" });
        }

        [HttpPost("set-initial-password")]
        public async Task<IActionResult> SetInitialPassword([FromBody] SetPasswordRequest request)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.DNI == request.DNI);

            if (usuario == null) return NotFound("Usuario no encontrado");
            if (!string.IsNullOrEmpty(usuario.Password)) return BadRequest("La contraseña ya fue configurada");

            usuario.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Contraseña configurada con éxito" });
        }
    }
    
}
