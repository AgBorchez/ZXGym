using GymManager.api.Data;
using GymManager.api.Models;
using GymManager.api.Models.Socios;
using GymManager.api.Models.Usuarios;
using GymManager.api.Models.Usuarios.Login;
using GymManager.api.Models.Usuarios.Register.Staff;
using GymManager.api.Models.Usuarios.Register.Tokens;
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

        private readonly ITokenService _tokenService;

        // 2. INYECTARLO EN EL CONSTRUCTOR
        public UsuarioController(DataContext context, IUsuarioService usuarioService, ITokenService tokenService)
        {
            _context = context;
            _usuarioService = usuarioService;
            _tokenService = tokenService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetUsuarios(
    [FromQuery] string? buscar,
    [FromQuery] string? Type, // Filtro por rol: Socio, Entrenador, Manager
    [FromQuery] string SortBy = "Name",
    [FromQuery] bool IsAscending = true)
        {
            // 1. Iniciamos la query sobre la tabla Usuarios (Base)
            var query = _context.Usuarios.AsQueryable();

            // 2. Filtro por Rol (Tipo de usuario)
            if (!string.IsNullOrEmpty(Type) && Type.ToLower() != "todos")
            {
                // Usamos ILike para que no importe si viene "socio" o "Socio"
                query = query.Where(u => EF.Functions.ILike(u.Type, Type));
            }

            // 3. Filtro de búsqueda global (DNI, Nombre, Apellido, Email)
            if (!string.IsNullOrEmpty(buscar))
            {
                query = query.Where(u =>
                    EF.Functions.ILike(u.Name, $"%{buscar}%") ||
                    EF.Functions.ILike(u.LastName, $"%{buscar}%") ||
                    EF.Functions.ILike(u.Email, $"%{buscar}%") ||
                    u.DNI.ToString().Contains(buscar)); // Búsqueda por DNI
            }

            // 4. Ordenamiento dinámico
            query = SortBy.ToLower() switch
            {
                "dni" => IsAscending ? query.OrderBy(u => u.DNI) : query.OrderByDescending(u => u.DNI),
                "name" => IsAscending ? query.OrderBy(u => u.Name) : query.OrderByDescending(u => u.Name),
                "lastname" => IsAscending ? query.OrderBy(u => u.LastName) : query.OrderByDescending(u => u.LastName),
                "email" => IsAscending ? query.OrderBy(u => u.Email) : query.OrderByDescending(u => u.Email),
                "type" => IsAscending ? query.OrderBy(u => u.Type) : query.OrderByDescending(u => u.Type),
                _ => IsAscending ? query.OrderBy(u => u.Id) : query.OrderByDescending(u => u.Id),
            };

            // 5. Proyectamos a un objeto anónimo o un DTO para no devolver la contraseña (seguridad)
            var usuariosResponse = await query.Select(u => new UsuarioResponseDTO
            {
                Id = u.Id,
                DNI = u.DNI,
                Name = u.Name,
                LastName = u.LastName,
                Email = u.Email,
                Type = u.Type,
            }).ToListAsync();

            return Ok(usuariosResponse);
        }

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


        [HttpPost("register-Manager")]
        public async Task<IActionResult> RegisterStaff([FromBody] RegisterStaffRequest request)
        {
            // 1. IMPORTANTE: Agregamos el 'await' y cambiamos al nuevo nombre del método
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token, "manager");

            if (!esTokenValido)
            {
                return BadRequest(new { message = "Código de invitación inválido, ya utilizado o expirado (24hs)." });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // 2. Creamos el usuario base (Identidad)
                var nuevoStaff = await _usuarioService.CrearUsuarioBaseAsync(
                    request.DNI,
                    request.Name,
                    request.LastName,
                    request.Email,
                    request.Password,
                    "Manager"
                );

                _context.Usuarios.Add(nuevoStaff);
                await _context.SaveChangesAsync();
                await _tokenService.AnularTokenAsync(request.Token, "Manager");

                // 3. Consolidamos la transacción
                await transaction.CommitAsync();

                return Ok(new { message = $"Registro de {request.Type} exitoso." });
            }
            catch (Exception ex)
            {
                // Si falla el insert, deshacemos todo
                await transaction.RollbackAsync();
                var mensajeReal = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return BadRequest(new { message = mensajeReal });
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

        [HttpGet("generate-Manager-token")]
        public async Task<IActionResult> GenerateEntrenadorToken()
        {
            try
            {
                
                var managerToken = await _tokenService.GenerarNuevoTokenAsync("manager");

                return Ok(new
                {
                    managerCode = managerToken,
                    expiresAt = DateTime.UtcNow.AddHours(24) 
                });
            }
            catch (Exception ex)
            {
                // Loguear el error si es necesario
                return StatusCode(500, new { message = "Error al generar los tokens de invitación", error = ex.Message });
            }
        }

        [HttpGet("generate-Entrenador-token")]
        public async Task<IActionResult> GenerateManagerToken()
        {
            try
            {
                // 1. Generamos los tokens llamando a la lógica asíncrona del servicio
                // Esto limpia la tabla de tokens viejos e inserta los nuevos
                var entrenadorToken = await _tokenService.GenerarNuevoTokenAsync("entrenador");

                // 2. Devolvemos los códigos al Manager (Front-end)
                return Ok(new
                {
                    entrenadorCode = entrenadorToken,
                    expiresAt = DateTime.UtcNow.AddHours(24) // Referencia visual para el Front
                });
            }
            catch (Exception ex)
            {
                // Loguear el error si es necesario
                return StatusCode(500, new { message = "Error al generar los tokens de invitación", error = ex.Message });
            }
        }
    }
}
