using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UseCaseFinalSubmission.Migrations
{
    /// <inheritdoc />
    public partial class k2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Enrollement Table_Course Table_CourseId",
                table: "Enrollement Table");

            migrationBuilder.DropForeignKey(
                name: "FK_Enrollement Table_Student Table_StudentId",
                table: "Enrollement Table");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Student Table",
                table: "Student Table");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Enrollement Table",
                table: "Enrollement Table");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Course Table",
                table: "Course Table");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Admin Table",
                table: "Admin Table");

            migrationBuilder.RenameTable(
                name: "Student Table",
                newName: "Student");

            migrationBuilder.RenameTable(
                name: "Enrollement Table",
                newName: "Enrollements");

            migrationBuilder.RenameTable(
                name: "Course Table",
                newName: "Course");

            migrationBuilder.RenameTable(
                name: "Admin Table",
                newName: "admin");

            migrationBuilder.RenameIndex(
                name: "IX_Student Table_Email_Phone",
                table: "Student",
                newName: "IX_Student_Email_Phone");

            migrationBuilder.RenameIndex(
                name: "IX_Enrollement Table_StudentId_CourseId",
                table: "Enrollements",
                newName: "IX_Enrollements_StudentId_CourseId");

            migrationBuilder.RenameIndex(
                name: "IX_Enrollement Table_CourseId",
                table: "Enrollements",
                newName: "IX_Enrollements_CourseId");

            migrationBuilder.RenameIndex(
                name: "IX_Admin Table_Email",
                table: "admin",
                newName: "IX_admin_Email");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Student",
                table: "Student",
                column: "StudentId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Enrollements",
                table: "Enrollements",
                column: "EnrollementId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Course",
                table: "Course",
                column: "CourseId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_admin",
                table: "admin",
                column: "AdminId");

            migrationBuilder.AddForeignKey(
                name: "FK_Enrollements_Course_CourseId",
                table: "Enrollements",
                column: "CourseId",
                principalTable: "Course",
                principalColumn: "CourseId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Enrollements_Student_StudentId",
                table: "Enrollements",
                column: "StudentId",
                principalTable: "Student",
                principalColumn: "StudentId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Enrollements_Course_CourseId",
                table: "Enrollements");

            migrationBuilder.DropForeignKey(
                name: "FK_Enrollements_Student_StudentId",
                table: "Enrollements");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Student",
                table: "Student");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Enrollements",
                table: "Enrollements");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Course",
                table: "Course");

            migrationBuilder.DropPrimaryKey(
                name: "PK_admin",
                table: "admin");

            migrationBuilder.RenameTable(
                name: "Student",
                newName: "Student Table");

            migrationBuilder.RenameTable(
                name: "Enrollements",
                newName: "Enrollement Table");

            migrationBuilder.RenameTable(
                name: "Course",
                newName: "Course Table");

            migrationBuilder.RenameTable(
                name: "admin",
                newName: "Admin Table");

            migrationBuilder.RenameIndex(
                name: "IX_Student_Email_Phone",
                table: "Student Table",
                newName: "IX_Student Table_Email_Phone");

            migrationBuilder.RenameIndex(
                name: "IX_Enrollements_StudentId_CourseId",
                table: "Enrollement Table",
                newName: "IX_Enrollement Table_StudentId_CourseId");

            migrationBuilder.RenameIndex(
                name: "IX_Enrollements_CourseId",
                table: "Enrollement Table",
                newName: "IX_Enrollement Table_CourseId");

            migrationBuilder.RenameIndex(
                name: "IX_admin_Email",
                table: "Admin Table",
                newName: "IX_Admin Table_Email");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Student Table",
                table: "Student Table",
                column: "StudentId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Enrollement Table",
                table: "Enrollement Table",
                column: "EnrollementId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Course Table",
                table: "Course Table",
                column: "CourseId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Admin Table",
                table: "Admin Table",
                column: "AdminId");

            migrationBuilder.AddForeignKey(
                name: "FK_Enrollement Table_Course Table_CourseId",
                table: "Enrollement Table",
                column: "CourseId",
                principalTable: "Course Table",
                principalColumn: "CourseId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Enrollement Table_Student Table_StudentId",
                table: "Enrollement Table",
                column: "StudentId",
                principalTable: "Student Table",
                principalColumn: "StudentId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
