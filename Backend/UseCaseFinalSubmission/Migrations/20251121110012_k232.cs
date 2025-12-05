using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UseCaseFinalSubmission.Migrations
{
    /// <inheritdoc />
    public partial class k232 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Admin Table",
                columns: table => new
                {
                    AdminId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admin Table", x => x.AdminId);
                });

            migrationBuilder.CreateTable(
                name: "Course Table",
                columns: table => new
                {
                    CourseId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CourseName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CourseDescription = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Capacity = table.Column<int>(type: "int", nullable: false),
                    AvailableSeats = table.Column<int>(type: "int", nullable: false),
                    EnrolledCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Course Table", x => x.CourseId);
                });

            migrationBuilder.CreateTable(
                name: "Student Table",
                columns: table => new
                {
                    StudentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    datetime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Student Table", x => x.StudentId);
                });

            migrationBuilder.CreateTable(
                name: "Enrollement Table",
                columns: table => new
                {
                    EnrollementId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CourseId = table.Column<int>(type: "int", nullable: false),
                    StudentId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Enrollement Table", x => x.EnrollementId);
                    table.ForeignKey(
                        name: "FK_Enrollement Table_Course Table_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Course Table",
                        principalColumn: "CourseId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Enrollement Table_Student Table_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Student Table",
                        principalColumn: "StudentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Admin Table",
                columns: new[] { "AdminId", "Password", "Role", "UserName" },
                values: new object[] { 1, "Raju", "Admin", "Praveen" });

            migrationBuilder.CreateIndex(
                name: "IX_Enrollement Table_CourseId",
                table: "Enrollement Table",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Enrollement Table_StudentId_CourseId",
                table: "Enrollement Table",
                columns: new[] { "StudentId", "CourseId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Student Table_Email_Phone",
                table: "Student Table",
                columns: new[] { "Email", "Phone" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Admin Table");

            migrationBuilder.DropTable(
                name: "Enrollement Table");

            migrationBuilder.DropTable(
                name: "Course Table");

            migrationBuilder.DropTable(
                name: "Student Table");
        }
    }
}
