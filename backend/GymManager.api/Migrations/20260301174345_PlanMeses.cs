using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GymManager.api.Migrations
{
    /// <inheritdoc />
    public partial class PlanMeses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PlanId",
                table: "Socios",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PlanId",
                table: "Socios");
        }
    }
}
