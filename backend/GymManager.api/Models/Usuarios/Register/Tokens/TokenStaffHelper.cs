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
            // --- 1. LIMPIEZA AUTOMÁTICA ---
            // Borramos de la DB cualquier token que tenga más de 24hs (usado o no)
            var fechaLimite = DateTime.UtcNow.AddHours(-24);
            var tokensExpirados = _context.InvitacionesStaff
                .Where(t => t.FechaCreacion < fechaLimite);

            _context.InvitacionesStaff.RemoveRange(tokensExpirados);

            // --- 2. GENERACIÓN ÚNICA ---
            string prefijo = rol.ToLower() == "entrenador" ? "TR-" : "MN-";
            // Usamos un fragmento de GUID para asegurar que sean "infinitos" y únicos
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
            var fechaLimite = DateTime.UtcNow.AddHours(-24);

            // Buscamos un token que coincida, que sea del rol correcto,
            // que NO haya sido usado y que NO tenga más de 24hs.
            var invitacion = await _context.InvitacionesStaff.FirstOrDefaultAsync(i => i.Codigo == tokenEnviado 
            && i.Rol == rol.ToLower() && !i.Usado && i.FechaCreacion > fechaLimite);

            if (invitacion == null) return false;

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