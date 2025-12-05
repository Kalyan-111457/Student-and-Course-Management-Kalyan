using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UseCaseFinalSubmission.Migrations
{
    /// <inheritdoc />
    public partial class k2121 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserName",
                table: "Admin Table",
                newName: "Email");

            migrationBuilder.UpdateData(
                table: "Admin Table",
                keyColumn: "AdminId",
                keyValue: 1,
                column: "Email",
                value: "Praveen@example.com");

            migrationBuilder.CreateIndex(
                name: "IX_Admin Table_Email",
                table: "Admin Table",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Admin Table_Email",
                table: "Admin Table");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Admin Table",
                newName: "UserName");

            migrationBuilder.UpdateData(
                table: "Admin Table",
                keyColumn: "AdminId",
                keyValue: 1,
                column: "UserName",
                value: "Praveen");
        }
    }
}
