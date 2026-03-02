using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using GymManager.api.Models;
using GymManager.api.Data;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

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
        public async Task<ActionResult<IEnumerable<Socio>>> GetAll(
            [FromQuery] string? buscar,
            [FromQuery] string SortBy = "DNI",
            [FromQuery] bool IsAscending = true,
            [FromQuery] bool ActiveOnly = true)
        {
            var query = _context.Socios.AsQueryable();

            if (ActiveOnly)
            {
                query = query.Where(s => s.EndDate > DateTime.UtcNow);
            }
            else
            {
                query = query.Where(s => s.EndDate < DateTime.UtcNow);
            }

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

            var socios = await query.ToListAsync();
            return Ok(socios);
        }

        [HttpPost]

        public async Task<ActionResult<Socio>> Create(Socio nuevoSocio)
        {
            if (nuevoSocio.JoinDate == default) return BadRequest("Error al determinar fecha de ingreso");

            nuevoSocio.JoinDate = DateTime.SpecifyKind(nuevoSocio.JoinDate, DateTimeKind.Utc);
            nuevoSocio.EndDate = DateTime.SpecifyKind(nuevoSocio.EndDate, DateTimeKind.Utc);
            
            _context.Socios.Add(nuevoSocio);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), new { DNI = nuevoSocio.DNI }, nuevoSocio);
        }

        [HttpGet("{DNI}")]
        public async Task<ActionResult<Socio>> GetByDNI(int DNI)
        {
            var socio = await _context.Socios.FindAsync(DNI);

            if (socio == null)
                return NotFound("el socio no existe");

            return Ok(socio);
        }

        [HttpPut("{DNI}")]
        public async Task<ActionResult<Socio>> Update(int DNI, Socio SocioActualizado)
        {
            if (DNI != SocioActualizado.DNI) return BadRequest("El dni no coincide -.-");
            var dbsocio = await _context.Socios.FindAsync(DNI);

            if (dbsocio == null)
                return NotFound("socio no encontrado");

            dbsocio.Name = SocioActualizado.Name;
            dbsocio.LastName = SocioActualizado.LastName;
            dbsocio.Email = SocioActualizado.Email;
            dbsocio.JoinDate = DateTime.SpecifyKind(SocioActualizado.JoinDate, DateTimeKind.Utc);
            dbsocio.EndDate = DateTime.SpecifyKind(SocioActualizado.EndDate, DateTimeKind.Utc);

            await _context.SaveChangesAsync();

            return Ok(dbsocio);
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
