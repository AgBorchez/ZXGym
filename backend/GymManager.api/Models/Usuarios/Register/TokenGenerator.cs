using System.Security.Cryptography;
using System.Text;

namespace GymManager.api.Models.Usuarios.Register
{
    public class TokenGenerator
    {
        private const string SecretStaff = "ESTO_ES_UNA_SEMILLA_MUY_LARGA_Y_SECRETA";

        public static string GenerarTokenActual()
        {
            // Creamos un bloque de tiempo de 30 minutos
            long timeStep = DateTimeOffset.UtcNow.ToUnixTimeSeconds() / 1800;

            // Creamos un hash único combinando la semilla y el tiempo
            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(SecretStaff)))
            {
                byte[] hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(timeStep.ToString()));

                // Convertimos parte del hash en un código numérico o alfanumérico
                int binaryCode = BitConverter.ToInt32(hash, 0) & 0x7FFFFFFF;
                return (binaryCode % 1000000).ToString("D6"); // Código de 6 dígitos
            }
        }


        public static bool ValidarToken(string tokenEnviado)
        {
            return tokenEnviado == GenerarTokenActual();
        }
    }
}
