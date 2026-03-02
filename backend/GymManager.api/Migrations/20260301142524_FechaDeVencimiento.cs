using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GymManager.api.Migrations
{
    /// <inheritdoc />
    public partial class FechaDeVencimiento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Socios");

            migrationBuilder.RenameColumn(
                name: "JoinedDate",
                table: "Socios",
                newName: "JoinDate");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "Socios",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "Socios");

            migrationBuilder.RenameColumn(
                name: "JoinDate",
                table: "Socios",
                newName: "JoinedDate");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Socios",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
