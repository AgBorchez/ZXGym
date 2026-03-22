using GymManager.api.Data;
using GymManager.api.Models;
using GymManager.api.Models.Socios;
using GymManager.api.Models.Usuarios;
using GymManager.api.Models.Usuarios.Login;
using GymManager.api.Models.Usuarios.Register;
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

        private readonly IUsuarioService _usuarioService;

        // 2. INYECTARLO EN EL CONSTRUCTOR
        public UsuarioController(DataContext context, IUsuarioService usuarioService)
        {
            _context = context;
            _usuarioService = usuarioService;
        }

        // --- MÉTODOS PRIVADOS DE APOYO (REUTILIZABLES) ---

        // --- ENDPOINTS ---

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (usuario == null || (!string.IsNullOrEmpty(usuario.Password) && !BCrypt.Net.BCrypt.Verify(request.Password, usuario.Password)))
                return Unauthorized(new { message = "Email o contraseña incorrectos" });

            if (string.IsNullOrEmpty(usuario.Password))
                return Ok(new { status = "PENDING_PASSWORD", message = "Configurá tu contraseña", dni = usuario.DNI });

            return Ok(new { id = usuario.Id, nombre = usuario.Name, tipo = usuario.Type, dni = usuario.DNI });
        }

        [HttpPost("register-socio")]
        public async Task<IActionResult> RegisterSocio([FromBody] RegistroSocioRequest request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var nuevoUsuario = await _usuarioService.CrearUsuarioBaseAsync(request.DNI, request.Name, request.LastName, request.Email, request.Password, "Socio");

                var nuevoSocio = new Socio
                {
                    DNI = nuevoUsuario.DNI,
                    Name = request.Name,
                    LastName = request.LastName,
                    Email = request.Email,
                    Phone = request.Phone,
                    PlanId = request.PlanId,
                    JoinDate = DateTime.Now,
                    EndDate = DateTime.Now.AddMonths(1)
                };

                _context.Usuarios.Add(nuevoUsuario);
                _context.Socios.Add(nuevoSocio);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Socio registrado con éxito" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("register-staff")]
        public async Task<IActionResult> RegisterStaff([FromBody] RegisterStaffRequest request)
        {
            if (!TokenStaffHelper.ValidarToken(request.Token, request.Type))
                return BadRequest(new { message = "Código de invitación inválido o expirado." });

            try
            {
                var nuevoStaff = await _usuarioService.CrearUsuarioBaseAsync(request.DNI, request.Name, request.LastName, request.Email, request.Password, request.Type);
                _context.Usuarios.Add(nuevoStaff);
                await _context.SaveChangesAsync();

                return Ok(new { message = $"Registro de {request.Type} exitoso." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("set-initial-password")]
        public async Task<IActionResult> SetInitialPassword([FromBody] SetPasswordRequest request)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.DNI == request.DNI);
            if (usuario == null || !string.IsNullOrEmpty(usuario.Password))
                return BadRequest(new { message = "Acción no permitida o usuario inexistente." });

            usuario.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Contraseña configurada con éxito" });
        }

        [HttpGet("get-current-tokens")]
        public IActionResult GetCurrentTokens() => Ok(new
        {
            entrenadorCode = TokenStaffHelper.GenerarTokenActual("entrenador"),
            managerCode = TokenStaffHelper.GenerarTokenActual("manager")
        });
    }
}
