using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GymManager.api.Migrations
{
    /// <inheritdoc />
    public partial class PlanId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Socios",
                newName: "DNI");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DNI",
                table: "Socios",
                newName: "Id");
        }
    }
}
