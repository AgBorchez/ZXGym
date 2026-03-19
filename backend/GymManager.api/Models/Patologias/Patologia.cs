using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymManager.api.Models.Patologias
{
    public class Patologia
    {
        [Key]
        public int id { get; set; }
        public string nombre { get; set; }

    }
}
