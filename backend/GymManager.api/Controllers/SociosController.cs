using GymManager.api.Data;
using GymManager.api.Models;
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

        public SociosController(DataContext context)
        {
            _context = context;
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
                _ => IsAscending ? query.OrderBy(s => s.DNI) : query.OrderByDescending(s => s.DNI),
            };

            var SociosResponse = await query.Select(s => new SocioResponseDTO
            {
                DNI = s.DNI,
                Name = s.Name,
                LastName = s.LastName,
                Email = s.Email,
                Phone = s.Phone,
                JoinDate = s.JoinDate,
                EndDate = s.EndDate,
                PlanId = s.PlanId,
                Patologias = Tabla_Patologias ? _context.Socios_Patologias.Where(sp => sp.Socio_DNI == s.DNI).Select(sp => sp.Patologia_id).ToList() : null
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
                            Socio_DNI = socioToAppend.DNI,
                            Patologia_id = patologiaId
                        };
                        _context.Socios_Patologias.Add(relacion);
                    }
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();

                return CreatedAtAction(nameof(GetAll), new { DNI = socioToAppend.DNI }, socioToAppend);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Error al crear el socio: {ex.Message}");
            }
        }

        [HttpGet("{DNI}")]
        public async Task<ActionResult<SocioResponseDTO>> GetByDNI(int DNI)
        {
            var socioDto = await _context.Socios.Where(s => s.DNI == DNI).Select(s => new SocioResponseDTO
            {
                    DNI = s.DNI,
                    Name = s.Name,
                    LastName = s.LastName,
                    Email = s.Email,    
                    Phone = s.Phone,
                    JoinDate = s.JoinDate,
                    EndDate = s.EndDate,
                    PlanId = s.PlanId,
                Patologias = _context.Socios_Patologias.Where(sp => sp.Socio_DNI == s.DNI).Select(sp => sp.Patologia_id).ToList()
            }).FirstOrDefaultAsync();

            if (socioDto == null)
                return NotFound("el socio no existe");

            return Ok(socioDto);
        }

        [HttpPut("{DNI}")]
        public async Task<ActionResult<SocioResponseDTO>> Update(int DNI, SocioResponseDTO SocioActualizado)
        {
            if (DNI != SocioActualizado.DNI) return BadRequest("El dni no coincide -.-");


            var dbsocio = await _context.Socios.FindAsync(DNI);

            if (dbsocio == null)
                return NotFound("socio no encontrado");

            dbsocio.Name = SocioActualizado.Name;
            dbsocio.LastName = SocioActualizado.LastName;
            dbsocio.Email = SocioActualizado.Email;
            dbsocio.Phone = SocioActualizado.Phone; 
            dbsocio.JoinDate = DateTime.SpecifyKind(SocioActualizado.JoinDate, DateTimeKind.Utc);
            dbsocio.EndDate = DateTime.SpecifyKind(SocioActualizado.EndDate, DateTimeKind.Utc);

            var idsNuevos = SocioActualizado.Patologias ?? new List<int>();

            var relacionesActuales = await _context.Socios_Patologias.Where(sp => sp.Socio_DNI == DNI).ToListAsync();

            var relacionesABorrar = relacionesActuales.Where(sp => !idsNuevos.Contains(sp.Patologia_id)).ToList();

            _context.Socios_Patologias.RemoveRange(relacionesABorrar);

            var idsActualesEnDb = relacionesActuales.Select(sp => sp.Patologia_id).ToList();

            var relacionesAAgregar = idsNuevos.Where(id => !idsActualesEnDb.Contains(id)).Select(id => new Socio_Patologia
                {
                    Socio_DNI = DNI,
                    Patologia_id = id
                })
                .ToList();

            _context.Socios_Patologias.AddRange(relacionesAAgregar);

            await _context.SaveChangesAsync();

            return Ok(SocioActualizado);
        }

        [HttpDelete("{DNI}")]
        
        public async Task<ActionResult<Socio>> Delete(int DNI)
        {
            var dbsocio = await _context.Socios.FindAsync(DNI);

            if (dbsocio == null)
                return NotFound("Socio no encontrado para eliminar");

            _context.Socios.Remove(dbsocio);
            await _context.SaveChangesAsync();

            return Ok("Socio eliminado correctamente");
        }

    }
}
