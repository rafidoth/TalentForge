using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class EditUserPreferences : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProfileAttributes_UserPreferences_UserPreferenceId",
                table: "ProfileAttributes");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_UserPreferences_UserPreferenceId",
                table: "Projects");

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserPreferenceId",
                table: "Projects",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserPreferenceId",
                table: "ProfileAttributes",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Projects_UserPreferenceId",
                table: "Projects",
                column: "UserPreferenceId");

            migrationBuilder.CreateIndex(
                name: "IX_ProfileAttributes_UserPreferenceId",
                table: "ProfileAttributes",
                column: "UserPreferenceId");

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
    }
}
