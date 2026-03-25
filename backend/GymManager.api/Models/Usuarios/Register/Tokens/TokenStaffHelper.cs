using GymManager.api.Data;
using Microsoft.EntityFrameworkCore;

namespace GymManager.api.Models.Usuarios.Register.Tokens
{
    public interface ITokenService
    {
        // Ahora son Task porque acceden a la DB
        Task<string> GenerarNuevoTokenAsync(string rol);
        Task<bool> ValidarTokenAsync(string tokenEnviado, string rol);

        Task AnularTokenAsync(string tokenEnviado, string rol);
    }

    public class TokenStaffHelper : ITokenService
    {
        private readonly DataContext _context;

        public TokenStaffHelper(DataContext context)
        {
            _context = context;
        }

        public async Task<string> GenerarNuevoTokenAsync(string rol)
        {
            var fechaLimite = DateTime.UtcNow.AddHours(-24);
            var tokensExpirados = _context.InvitacionesStaff
                .Where(t => t.FechaCreacion < fechaLimite);

            _context.InvitacionesStaff.RemoveRange(tokensExpirados);

            string prefijo = rol.ToLower() == "entrenador" ? "TR-" : "MN-";
            string codePart = Guid.NewGuid().ToString().Substring(0, 8);
            string codigoFinal = $"{prefijo}{codePart}";

            var nuevaInvitacion = new InvitacionStaff
            {
                Codigo = codigoFinal,
                Rol = rol.ToLower(),
                FechaCreacion = DateTime.UtcNow,
                Usado = false
            };

            _context.InvitacionesStaff.Add(nuevaInvitacion);
            await _context.SaveChangesAsync();

            return codigoFinal;
        }

        public async Task<bool> ValidarTokenAsync(string tokenEnviado, string rol)
        {
            Console.WriteLine($"\n--- DEBUG TOKEN START ---");
            Console.WriteLine($"Recibido: '{tokenEnviado}' | Rol buscado: '{rol}'");

            var invitacion = await _context.InvitacionesStaff
                .FirstOrDefaultAsync(i => i.Codigo == tokenEnviado);

            if (invitacion == null)
            {
                Console.WriteLine("❌ FALLO: El código no existe en la base de datos.");
                return false;
            }

            bool rolCoincide = string.Equals(invitacion.Rol.Trim(), rol.Trim(), StringComparison.OrdinalIgnoreCase);
            if (!rolCoincide)
            {
                Console.WriteLine($"❌ FALLO ROL: DB tiene '{invitacion.Rol}' pero el Form mandó '{rol}'");
                return false;
            }

            if (invitacion.Usado)
            {
                Console.WriteLine("❌ FALLO ESTADO: El token ya figura como USADO (true) en la DB.");
                return false;
            }

            var fechaLimite = DateTime.Now.AddHours(-24);
            Console.WriteLine($"Fecha Creación DB: {invitacion.FechaCreacion} | Límite: {fechaLimite}");

            if (invitacion.FechaCreacion < fechaLimite)
            {
                Console.WriteLine("❌ FALLO FECHA: El token tiene más de 24hs de antigüedad.");
                return false;
            }

            Console.WriteLine("✅ ÉXITO: Token validado correctamente.");
            Console.WriteLine("--- DEBUG TOKEN END ---\n");

            return true;
        }

        public async Task AnularTokenAsync(string tokenEnviado, string rol)
        {
            var invitacion = await _context.InvitacionesStaff.FirstOrDefaultAsync(i => i.Codigo == tokenEnviado
            && i.Rol == rol.ToLower());

            if (invitacion != null)
            {
                invitacion.Usado = true;
                await _context.SaveChangesAsync();
            }
        }
    }
}