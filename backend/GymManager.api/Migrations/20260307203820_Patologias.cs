using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GymManager.api.Migrations
{
    /// <inheritdoc />
    public partial class Patologias : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Patalogias",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patalogias", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "socio_patologia",
                columns: table => new
                {
                    socio_dni = table.Column<int>(type: "integer", nullable: false),
                    patologia_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_socio_patologia", x => new { x.socio_dni, x.patologia_id });
                    table.ForeignKey(
                        name: "FK_socio_patologia_Patalogias_patologia_id",
                        column: x => x.patologia_id,
                        principalTable: "Patalogias",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_socio_patologia_Socios_socio_dni",
                        column: x => x.socio_dni,
                        principalTable: "Socios",
                        principalColumn: "DNI",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Patalogias",
                columns: new[] { "id", "nombre" },
                values: new object[,]
                {
                    { 1, "Hipertensión Arterial" },
                    { 2, "Problemas Cardíacos" },
                    { 3, "Lesiones de Columna" },
                    { 4, "Lesiones Articulares" },
                    { 5, "Asma / Problemas Respiratorios" },
                    { 6, "Diabetes" },
                    { 7, "Cirugías Recientes" },
                    { 8, "Mareos / Vértigo" },
                    { 9, "Embarazo" },
                    { 10, "Medicación Crónica" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_socio_patologia_patologia_id",
                table: "socio_patologia",
                column: "patologia_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "socio_patologia");

            migrationBuilder.DropTable(
                name: "Patalogias");
        }
    }
}
