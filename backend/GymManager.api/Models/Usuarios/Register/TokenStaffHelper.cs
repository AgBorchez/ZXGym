using System.Security.Cryptography;
using System.Text;

namespace GymManager.api.Models.Usuarios.Register
{
    public class TokenStaffHelper
    {
        private const string SecretBase = "ZX-GYM-SUPER-SECRET-2026"; // Cambiá esto por algo complejo

        public static string GenerarTokenActual(string rol)
        {
            // Dividimos el tiempo en bloques de 24 horas (86400 segundos)
            long timeStep = DateTimeOffset.UtcNow.ToUnixTimeSeconds() / 86400;

            // Combinamos Secreto + Rol + Tiempo para que el código de Trainer sea distinto al de Manager
            string rawData = $"{SecretBase}-{rol.ToLower()}-{timeStep}";

            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(SecretBase)))
            {
                byte[] hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(rawData));
                // Tomamos 4 bytes y los convertimos a un número positivo de 6 dígitos
                int binaryCode = BitConverter.ToInt32(hash, 0) & 0x7FFFFFFF;
                return (binaryCode % 1000000).ToString("D6");
            }
        }

    public static bool ValidarToken(string tokenEnviado, string rol)
        {
            // Comparamos el enviado con el calculado en el momento
            return tokenEnviado == GenerarTokenActual(rol);
        }
    }
}