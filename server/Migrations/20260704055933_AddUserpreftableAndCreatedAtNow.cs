using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class AddUserpreftableAndCreatedAtNow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserPreferenceId",
                table: "Projects",
                type: "uuid",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "ProfileAttributes",
                type: "timestamp with time zone",
                nullable: true,
                defaultValueSql: "now()",
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserPreferenceId",
                table: "ProfileAttributes",
                type: "uuid",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Attributes",
                type: "timestamp with time zone",
                nullable: true,
                defaultValueSql: "now()",
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "UserPreferences",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    Theme = table.Column<string>(type: "text", nullable: false),
                    Language = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPreferences", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserPreferences_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Projects_UserPreferenceId",
                table: "Projects",
                column: "UserPreferenceId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfileAttributes_UserPreferenceId",
                table: "ProfileAttributes",
                column: "UserPreferenceId");

            migrationBuilder.CreateIndex(
                name: "IX_UserPreferences_UserId",
                table: "UserPreferences",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProfileAttributes_UserPreferences_UserPreferenceId",
                table: "ProfileAttributes",
                column: "UserPreferenceId",
                principalTable: "UserPreferences",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_UserPreferences_UserPreferenceId",
                table: "Projects",
                column: "UserPreferenceId",
                principalTable: "UserPreferences",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProfileAttributes_UserPreferences_UserPreferenceId",
                table: "ProfileAttributes");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_UserPreferences_UserPreferenceId",
                table: "Projects");

            migrationBuilder.DropTable(
                name: "UserPreferences");

            migrationBuilder.DropIndex(
                name: "IX_Projects_UserPreferenceId",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_ProfileAttributes_UserPreferenceId",
                table: "ProfileAttributes");

            migrationBuilder.DropColumn(
                name: "UserPreferenceId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "UserPreferenceId",
                table: "ProfileAttributes");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "ProfileAttributes",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true,
                oldDefaultValueSql: "now()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Attributes",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true,
                oldDefaultValueSql: "now()");
        }
    }
}
