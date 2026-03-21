using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace GymManager.api.Migrations
{
    /// <inheritdoc />
    public partial class paso1_CrearUsuarios : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DNI = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    Password = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Socios_DNI",
                table: "Socios",
                column: "DNI");

            migrationBuilder.CreateIndex(
                name: "IX_Entrenadores_DNI",
                table: "Entrenadores",
                column: "DNI");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_DNI",
                table: "Usuarios",
                column: "DNI",
                unique: true);

            migrationBuilder.Sql(@"
                /* Mudar Socios */
                INSERT INTO ""Usuarios"" (""DNI"", ""Name"", ""LastName"", ""Email"", ""Type"")
                SELECT ""DNI"", ""Name"", ""LastName"", ""Email"", 'Socio' FROM ""Socios"";

                /* Mudar Entrenadores */
                INSERT INTO ""Usuarios"" (""DNI"", ""Name"", ""LastName"", ""Email"", ""Type"")
                SELECT ""DNI"", ""Name"", ""LastName"", ""Email"", 'Entrenador' FROM ""Entrenadores"";
            ");

            migrationBuilder.AddForeignKey(
                name: "FK_Entrenadores_Usuarios_DNI",
                table: "Entrenadores",
                column: "DNI",
                principalTable: "Usuarios",
                principalColumn: "DNI",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Socios_Usuarios_DNI",
                table: "Socios",
                column: "DNI",
                principalTable: "Usuarios",
                principalColumn: "DNI",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Entrenadores_Usuarios_DNI",
                table: "Entrenadores");

            migrationBuilder.DropForeignKey(
                name: "FK_Socios_Usuarios_DNI",
                table: "Socios");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_Socios_DNI",
                table: "Socios");

            migrationBuilder.DropIndex(
                name: "IX_Entrenadores_DNI",
                table: "Entrenadores");
        }
    }
}
