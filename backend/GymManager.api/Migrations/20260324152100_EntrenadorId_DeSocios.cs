using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GymManager.api.Migrations
{
    /// <inheritdoc />
    public partial class EntrenadorId_DeSocios : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EntrenadorId",
                table: "Socios",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Socios_EntrenadorId",
                table: "Socios",
                column: "EntrenadorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Socios_Usuarios_EntrenadorId",
                table: "Socios",
                column: "EntrenadorId",
                principalTable: "Usuarios",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Socios_Usuarios_EntrenadorId",
                table: "Socios");

            migrationBuilder.DropIndex(
                name: "IX_Socios_EntrenadorId",
                table: "Socios");

            migrationBuilder.DropColumn(
                name: "EntrenadorId",
                table: "Socios");
        }
    }
}
