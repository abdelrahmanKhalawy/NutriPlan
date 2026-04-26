using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MealPlanPlatform.API.Migrations
{
    /// <inheritdoc />
    public partial class FixUserCoachRelation2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserCoaches_Coaches_CoachId",
                table: "UserCoaches");

            migrationBuilder.DropForeignKey(
                name: "FK_UserCoaches_Users_UserId",
                table: "UserCoaches");

            migrationBuilder.DropTable(
                name: "Coaches");

            migrationBuilder.AddForeignKey(
                name: "FK_UserCoaches_Users_CoachId",
                table: "UserCoaches",
                column: "CoachId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserCoaches_Users_UserId",
                table: "UserCoaches",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserCoaches_Users_CoachId",
                table: "UserCoaches");

            migrationBuilder.DropForeignKey(
                name: "FK_UserCoaches_Users_UserId",
                table: "UserCoaches");

            migrationBuilder.CreateTable(
                name: "Coaches",
                columns: table => new
                {
                    CoachId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Bio = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExperienceLevel = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coaches", x => x.CoachId);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_UserCoaches_Coaches_CoachId",
                table: "UserCoaches",
                column: "CoachId",
                principalTable: "Coaches",
                principalColumn: "CoachId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserCoaches_Users_UserId",
                table: "UserCoaches",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
