using GymManager.api.Data;
using GymManager.api.Models;
using GymManager.api.Models.Socios;
using GymManager.api.Models.Usuarios;
using GymManager.api.Models.Usuarios.Register.Socios;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace GymManager.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SociosController : ControllerBase
    {

        private readonly DataContext _context;

        private readonly IUsuarioService _usuarioService;

        public SociosController(DataContext context, IUsuarioService usuarioService)
        {
            _context = context;
            _usuarioService = usuarioService;

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SocioResponseDTO>>> GetAll(
            [FromQuery] string? buscar,
            [FromQuery] bool Tabla_Patologias = false,
            [FromQuery] string SortBy = "DNI",
            [FromQuery] bool IsAscending = true,
            [FromQuery] bool ActiveOnly = true)
        {
            var query = _context.Socios.AsQueryable();
            var FechaActual = DateTime.UtcNow;

            query = ActiveOnly ? query.Where(s => s.EndDate > FechaActual) : query.Where(s => s.EndDate < FechaActual);

            if (!string.IsNullOrEmpty(buscar))
            {
                query = query.Where(s => EF.Functions.ILike(s.Name, $"%{buscar}%") || EF.Functions.ILike(s.LastName, $"%{buscar}%") || EF.Functions.ILike(s.Email, $"%{buscar}%"));
            }

            query = SortBy.ToLower() switch
            {
                "name" => IsAscending ? query.OrderBy(s => s.Name) : query.OrderByDescending(s => s.Name),
                "lastname" => IsAscending ? query.OrderBy(s => s.LastName) : query.OrderByDescending(s => s.LastName),
                "email" => IsAscending ? query.OrderBy(s => s.Email) : query.OrderByDescending(s => s.Email),
                "JoinDate" => IsAscending ? query.OrderBy(s => s.JoinDate) : query.OrderByDescending(s => s.JoinDate),
                "EndDate" => IsAscending ? query.OrderBy(s => s.EndDate) : query.OrderByDescending(s => s.EndDate),
                _ => IsAscending ? query.OrderBy(s => s.Id) : query.OrderByDescending(s => s.Id),
            };

            var SociosResponse = await query.Select(s => new SocioResponseDTO
            {
                Id = s.Id,
                DNI = s.DNI,
                Name = s.Name,
                LastName = s.LastName,
                Email = s.Email,
                Phone = s.Phone,
                JoinDate = s.JoinDate,
                EndDate = s.EndDate,
                PlanId = s.PlanId,
                Patologias = Tabla_Patologias ? _context.Socios_Patologias.Where(sp => sp.Socio_Id == s.Id).Join(_context.Patalogias, sp => sp.Patologia_id, p => p.id, (sp, p) => p.nombre).ToList() : null
            }).ToListAsync();
            
            return Ok(SociosResponse);
        }
        [HttpPost]

        public async Task<ActionResult<Socio>> Create(SocioCreateDTO nuevoSocio)
        {
            if (nuevoSocio.JoinDate == default) return BadRequest("Error al determinar fecha de ingreso");

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {

                Socio socioToAppend = new Socio
                {
                    DNI = nuevoSocio.DNI,
                    Name = nuevoSocio.Name,
                    LastName = nuevoSocio.LastName,
                    Email = nuevoSocio.Email,
                    Phone = nuevoSocio.Phone,
                    JoinDate = DateTime.SpecifyKind(nuevoSocio.JoinDate, DateTimeKind.Utc),
                    EndDate = DateTime.SpecifyKind(nuevoSocio.EndDate, DateTimeKind.Utc),
                    PlanId = nuevoSocio.PlanId
                };

                _context.Socios.Add(socioToAppend);
                await _context.SaveChangesAsync();

                if (nuevoSocio.Patologias != null && nuevoSocio.Patologias.Any())
                {
                    foreach (var patologiaId in nuevoSocio.Patologias)
                    {
                        var relacion = new Socio_Patologia
                        {
                            Socio_Id = socioToAppend.Id,
                            Patologia_id = patologiaId
                        };
                        _context.Socios_Patologias.Add(relacion);
                    }
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();

                return CreatedAtAction(nameof(GetAll), new { Id = socioToAppend.Id }, socioToAppend);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Error al crear el socio: {ex.Message}");
            }
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult<SocioResponseDTO>> GetById(int Id)
        {
            var socioDto = await _context.Socios.Where(s => s.Id == Id).Select(s => new SocioResponseDTO
            {
                Id = s.Id,
                DNI = s.DNI,
                Name = s.Name,
                LastName = s.LastName,
                Email = s.Email,    
                Phone = s.Phone,
                JoinDate = s.JoinDate,
                EndDate = s.EndDate,
                PlanId = s.PlanId,
                Patologias = _context.Socios_Patologias.Where(sp => sp.Socio_Id == s.Id)
                .Join(_context.Patalogias, sp => sp.Patologia_id, p => p.id, (sp, p) => p.nombre).ToList()
            }).FirstOrDefaultAsync();

            if (socioDto == null)
                return NotFound("el socio no existe");

            return Ok(socioDto);
        }

        [HttpPut("{Id}")]
        public async Task<ActionResult<SocioResponseDTO>> Update(int Id, SocioUpdateDTO SocioActualizado)
        {

            var dbsocio = await _context.Socios.FindAsync(Id);

            if (dbsocio == null)
                return NotFound("socio no encontrado");

            dbsocio.DNI = SocioActualizado.DNI;
            dbsocio.Name = SocioActualizado.Name;
            dbsocio.LastName = SocioActualizado.LastName;
            dbsocio.Email = SocioActualizado.Email;
            dbsocio.Phone = SocioActualizado.Phone; 
            dbsocio.JoinDate = DateTime.SpecifyKind(SocioActualizado.JoinDate, DateTimeKind.Utc);
            dbsocio.EndDate = DateTime.SpecifyKind(SocioActualizado.EndDate, DateTimeKind.Utc);

            var idsNuevos = SocioActualizado.Patologias ?? new List<int>();

            var relacionesActuales = await _context.Socios_Patologias.Where(sp => sp.Socio_Id == Id).ToListAsync();

            var relacionesABorrar = relacionesActuales.Where(sp => !idsNuevos.Contains(sp.Patologia_id)).ToList();

            _context.Socios_Patologias.RemoveRange(relacionesABorrar);

            var idsActualesEnDb = relacionesActuales.Select(sp => sp.Patologia_id).ToList();

            var relacionesAAgregar = idsNuevos.Where(id => !idsActualesEnDb.Contains(id)).Select(idpat => new Socio_Patologia
                {
                    Socio_Id = Id,
                    Patologia_id = idpat
                })
                .ToList();

            _context.Socios_Patologias.AddRange(relacionesAAgregar);

            await _context.SaveChangesAsync();

            return Ok(SocioActualizado);
        }

        [HttpDelete("{Id}")]
        
        public async Task<ActionResult<Socio>> Delete(int Id)
        {
            var dbsocio = await _context.Socios.FindAsync(Id);

            if (dbsocio == null)
                return NotFound("Socio no encontrado para eliminar");

            _context.Socios.Remove(dbsocio);
            await _context.SaveChangesAsync();

            return Ok("Socio eliminado correctamente");
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
                    JoinDate = DateTime.UtcNow,
                    EndDate = DateTime.UtcNow.AddMonths(request.PlanId)
                };

                _context.Usuarios.Add(nuevoUsuario);
                await _context.SaveChangesAsync();
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

    }
}
