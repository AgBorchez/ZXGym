using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using GymManager.api.Data;
using Microsoft.EntityFrameworkCore;
using GymManager.api.Models.Entrenadores;
using GymManager.api.Models.Socios;


namespace GymManager.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntrenadorController : ControllerBase
    {
        private readonly DataContext _context;

        public EntrenadorController(DataContext context)
        {
            _context = context;
        }

        // GET: api/entrenadores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EntrenadorResponseDTO>>> GetAll(
            [FromQuery] string? buscar,
            [FromQuery] string SortBy = "DNI",
            [FromQuery] bool IsAscending = true,
            [FromQuery] bool ActiveOnly = true)
        {
            var query = _context.Entrenadores.AsQueryable();

            // Filtro de Activos / Inactivos
            query = ActiveOnly ? query.Where(e => e.IsActive) : query.Where(e => !e.IsActive);

            // Búsqueda
            if (!string.IsNullOrEmpty(buscar))
            {
                buscar = buscar.ToLower();
                query = query.Where(e => e.Name.ToLower().Contains(buscar) ||
                                            e.LastName.ToLower().Contains(buscar) ||
                                            e.Specialty.ToLower().Contains(buscar));
            }

            // Ordenamiento dinámico
            query = SortBy.ToLower() switch
            {
                "name" => IsAscending ? query.OrderBy(e => e.Name) : query.OrderByDescending(e => e.Name),
                "lastname" => IsAscending ? query.OrderBy(e => e.LastName) : query.OrderByDescending(e => e.LastName),
                "specialty" => IsAscending ? query.OrderBy(e => e.Specialty) : query.OrderByDescending(e => e.Specialty),
                "shift" => IsAscending ? query.OrderBy(e => e.Shift) : query.OrderByDescending(e => e.Shift),
                "joindate" => IsAscending ? query.OrderBy(e => e.JoinDate) : query.OrderByDescending(e => e.JoinDate),
                "rcpdate" => IsAscending ? query.OrderBy(e => e.RCPExpirationDate) : query.OrderByDescending(e => e.RCPExpirationDate),
                _ => IsAscending ? query.OrderBy(e => e.Id) : query.OrderByDescending(e => e.Id),
            };

        var EntrenadoresResponseDTO = await query.Select(s => new EntrenadorResponseDTO
        {
            Id = s.Id,
            DNI = s.DNI,
            Name = s.Name,
            LastName = s.LastName,
            Email = s.Email,
            Phone = s.Phone,
            Specialty = s.Specialty,
            Shift = s.Shift,
            JoinDate = s.JoinDate,
            RCPExpirationDate = s.RCPExpirationDate,
            IsActive = s.IsActive   
        }).ToListAsync();

            return EntrenadoresResponseDTO;
        }

        // GET: api/entrenadores/5
        [HttpGet("{Id}")]
        public async Task<ActionResult<EntrenadorResponseDTO>> GetByDNI(int Id)
        {
            var entrenador = await _context.Entrenadores.FindAsync(Id);

            if (entrenador == null)
                return NotFound("El entrenador no existe.");

            return Ok(entrenador);
        }

        // POST: api/entrenadores
        [HttpPost]
        public async Task<ActionResult<Entrenador>> Create(EntrenadorCreateDTO nuevoEntrenador)
        {
            var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var EntrenadorToAppend = new Entrenador
                {
                    DNI = nuevoEntrenador.DNI,
                    Name = nuevoEntrenador.Name,
                    LastName = nuevoEntrenador.LastName,
                    Email = nuevoEntrenador.Email,
                    Phone = nuevoEntrenador.Phone,
                    Specialty = nuevoEntrenador.Specialty,
                    Shift = nuevoEntrenador.Shift,
                    JoinDate = DateTime.SpecifyKind(nuevoEntrenador.JoinDate, DateTimeKind.Utc),
                    RCPExpirationDate = DateTime.SpecifyKind(nuevoEntrenador.RCPExpirationDate, DateTimeKind.Utc),
                    IsActive = nuevoEntrenador.IsActive

                };

                _context.Add(EntrenadorToAppend);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return CreatedAtAction(nameof(GetAll), new { Id = EntrenadorToAppend.Id }, EntrenadorToAppend);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Error al crear el socio: {ex.Message}");
            }
        }

        // PUT: api/entrenadores/5
        [HttpPut("{Id}")]
        public async Task<IActionResult> Update(int Id, EntrenadorUpdateDTO entrenadorActualizado)
        {

            var entrenadorExistente = await _context.Entrenadores.FindAsync(Id);
            if (entrenadorExistente == null)
                return NotFound("Entrenador no encontrado.");

            entrenadorExistente.Name = entrenadorActualizado.Name;
            entrenadorExistente.LastName = entrenadorActualizado.LastName;
            entrenadorExistente.Email = entrenadorActualizado.Email;
            entrenadorExistente.Phone = entrenadorActualizado.Phone;
            entrenadorExistente.Specialty = entrenadorActualizado.Specialty;
            entrenadorExistente.Shift = entrenadorActualizado.Shift;
            entrenadorExistente.IsActive = entrenadorActualizado.IsActive;

            entrenadorExistente.JoinDate = DateTime.SpecifyKind(entrenadorActualizado.JoinDate, DateTimeKind.Utc);
            entrenadorExistente.RCPExpirationDate = DateTime.SpecifyKind(entrenadorActualizado.RCPExpirationDate, DateTimeKind.Utc);

            await _context.SaveChangesAsync();
            return Ok(entrenadorExistente);
        }

        // DELETE: api/entrenadores/5
        [HttpDelete("{Id}")]
        public async Task<IActionResult> Delete(int Id)
        {
            var entrenador = await _context.Entrenadores.FindAsync(Id);
            if (entrenador == null)
                return NotFound("Entrenador no encontrado.");

            _context.Entrenadores.Remove(entrenador);
            await _context.SaveChangesAsync();

            return Ok("Entrenador eliminado con éxito.");
        }
    }
}
