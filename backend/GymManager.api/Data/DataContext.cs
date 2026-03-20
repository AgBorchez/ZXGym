using Microsoft.EntityFrameworkCore;
using GymManager.api.Models.Entrenadores;
using GymManager.api.Models.Patologias;
using GymManager.api.Models.Socios;
using GymManager.api.Models.Usuarios;

namespace GymManager.api.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<Socio> Socios { get; set; }

        public DbSet<Patologia> Patalogias { get; set; }
        public DbSet<Socio_Patologia> Socios_Patologias { get; set; }

        public DbSet<Entrenador> Entrenadores {  get; set; }

        public DbSet<Usuario> Usuarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Socio_Patologia>()
                .HasKey(sp => new { sp.Socio_Id, sp.Patologia_id });

            modelBuilder.Entity<Patologia>().HasData(
                new Patologia { id = 1, nombre = "Hipertensión Arterial" },
                new Patologia { id = 2, nombre = "Problemas Cardíacos" },
                new Patologia { id = 3, nombre = "Lesiones de Columna" },
                new Patologia { id = 4, nombre = "Lesiones Articulares" },
                new Patologia { id = 5, nombre = "Asma / Problemas Respiratorios" },
                new Patologia { id = 6, nombre = "Diabetes" },
                new Patologia { id = 7, nombre = "Cirugías Recientes" },
                new Patologia { id = 8, nombre = "Mareos / Vértigo" },
                new Patologia { id = 9, nombre = "Embarazo" },
                new Patologia { id = 10, nombre = "Medicación Crónica" }

            );
        }

        
    }
}
