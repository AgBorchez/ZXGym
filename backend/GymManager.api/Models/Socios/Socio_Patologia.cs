using GymManager.api.Models.Patologias;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GymManager.api.Models.Socios
{
    [Table("socio_patologia")]
    public class Socio_Patologia
    {
        [Column("socio_id")]
        public int Socio_Id { get; set; }

        [ForeignKey("Socio_Id")]
        public Socio Datos_Socio { get; set; }

        [Column("patologia_id")]
        public int Patologia_id { get; set; }

        [ForeignKey("Patologia_id")]
        public Patologia Datos_Patologia { get; set; }
    }
}
