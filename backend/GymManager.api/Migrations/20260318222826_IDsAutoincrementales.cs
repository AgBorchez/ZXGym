using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace GymManager.api.Migrations
{
    /// <inheritdoc />
    public partial class IDsAutoincrementales : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.DropForeignKey(
                name: "FK_socio_patologia_Socios_socio_dni",
                table: "socio_patologia");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Socios",
                table: "Socios");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Entrenadores",
                table: "Entrenadores");

            migrationBuilder.RenameColumn(
                name: "socio_dni",
                table: "socio_patologia",
                newName: "socio_id");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Socios",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.Sql(@"
        UPDATE socio_patologia sp
        SET socio_id = s.""Id""
        FROM ""Socios"" s
        WHERE sp.socio_id = s.""DNI"";");

            migrationBuilder.AlterColumn<int>(
                name: "DNI",
                table: "Socios",
                type: "integer",
                nullable: false);

            migrationBuilder.AlterColumn<int>(
                name: "DNI",
                table: "Entrenadores",
                type: "integer",
                nullable: false);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Entrenadores",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Socios",
                table: "Socios",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Entrenadores",
                table: "Entrenadores",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_socio_patologia_Socios_socio_id",
                table: "socio_patologia",
                column: "socio_id",
                principalTable: "Socios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            
            migrationBuilder.DropForeignKey(
                name: "FK_socio_patologia_Socios_socio_id",
                table: "socio_patologia");

            migrationBuilder.Sql(@"
                UPDATE socio_patologia sp
                SET socio_id = s.""DNI""
                FROM ""Socios"" s
                WHERE sp.socio_id = s.""Id"";");

            
            migrationBuilder.DropPrimaryKey(name: "PK_Socios", table: "Socios");
            migrationBuilder.DropPrimaryKey(name: "PK_Entrenadores", table: "Entrenadores");

            
            migrationBuilder.DropColumn(name: "Id", table: "Socios");
            migrationBuilder.DropColumn(name: "Id", table: "Entrenadores");

            migrationBuilder.RenameColumn(
                name: "socio_id",
                table: "socio_patologia",
                newName: "socio_dni");

            migrationBuilder.AlterColumn<int>(
                name: "DNI",
                table: "Socios",
                type: "integer",
                nullable: false)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<int>(
                name: "DNI",
                table: "Entrenadores",
                type: "integer",
                nullable: false)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(name: "PK_Socios", table: "Socios", column: "DNI");
            migrationBuilder.AddPrimaryKey(name: "PK_Entrenadores", table: "Entrenadores", column: "DNI");

            migrationBuilder.AddForeignKey(
                name: "FK_socio_patologia_Socios_socio_dni",
                table: "socio_patologia",
                column: "socio_dni",
                principalTable: "Socios",
                principalColumn: "DNI",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
