using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using UseCase.Controllers;
using UseCaseFinalSubmission.Services.Interfaces;
using UseCaseFinalSubmission.Models;
using System.Collections.Generic;

namespace UseCaseFinalSubmission.Tests.Controllers
{
    public class AdminControllerTests
    {
        private readonly Mock<IAdminService> _adminServiceMock;
        private readonly AdminController _controller;

        public AdminControllerTests()
        {
            _adminServiceMock = new Mock<IAdminService>();
            _controller = new AdminController(_adminServiceMock.Object);
        }

        // ---------------- GET AllStudentEnrollments ----------------
        [Fact]
        public async Task GetAllStudentEnrollments_ReturnsOk_WithData()
        {
            _adminServiceMock.Setup(s => s.GetAllStudentEnrollmentsAsync())
                .ReturnsAsync(new List<object> { new { StudentId = 1 } });

            var result = await _controller.GetAllStudentEnrollments();

            Assert.IsType<OkObjectResult>(result);
        }

        // --------------- GET EnrolledStudentsByCourseId ----------------
        [Fact]
        public async Task GetEnrolledStudentsByCourseId_ReturnsOk_WhenFound()
        {
            int courseId = 1;
            _adminServiceMock.Setup(s => s.GetEnrolledStudentsByCourseIdAsync(courseId))
                .ReturnsAsync(new List<object> { new { StudentId = 10 } });

            var result = await _controller.GetEnrolledStudentsByCourseId(courseId);

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task GetEnrolledStudentsByCourseId_ReturnsNotFound_WhenNull()
        {
            _adminServiceMock.Setup(s => s.GetEnrolledStudentsByCourseIdAsync(1))
                .ReturnsAsync((List<object>)null);

            var result = await _controller.GetEnrolledStudentsByCourseId(1);

            Assert.IsType<NotFoundObjectResult>(result);
        }

        // ---------------- GET AllStudents ----------------
        [Fact]
        public async Task GetAllStudents_ReturnsOk_WithList()
        {
            _adminServiceMock.Setup(s => s.GetAllStudentsAsync())
                .ReturnsAsync(new List<Student>());

            var result = await _controller.GetAllStudents();

            Assert.IsType<OkObjectResult>(result);
        }

        // ---------------- POST StudentRegister ----------------
        [Fact]
        public async Task CreateRegister_ReturnsBadRequest_WhenModelInvalid()
        {
            _controller.ModelState.AddModelError("Name", "Required");

            var result = await _controller.CreateRegister(new Student());

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task CreateRegister_ReturnsBadRequest_WhenServiceReturnsMessage()
        {
            var response = new { message = "Email already exists" };

            _adminServiceMock.Setup(s => s.CreateStudentAsync(It.IsAny<Student>()))
                .ReturnsAsync(response);

            var result = await _controller.CreateRegister(new Student());

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task CreateRegister_ReturnsOk_WhenSuccess()
        {
            _adminServiceMock.Setup(s => s.CreateStudentAsync(It.IsAny<Student>()))
                .ReturnsAsync(new Student { StudentId = 1 });

            var result = await _controller.CreateRegister(new Student());

            Assert.IsType<OkObjectResult>(result);
        }

        // ---------------- PUT Update Student ----------------
        [Fact]
        public async Task UpdateStudent_ReturnsBadRequest_WhenInvalidId()
        {
            var result = await _controller.UpdateStudent(0, new Student());
            Assert.IsType<BadRequestObjectResult>(result);
        }


        [Fact]
        public async Task UpdateStudent_ReturnsNotFound_WhenNotFound()
        {
            var response = new { message = "Student not found." };

            _adminServiceMock.Setup(s => s.UpdateStudentAsync(1, It.IsAny<Student>()))
                .ReturnsAsync(response);

            var result = await _controller.UpdateStudent(1, new Student());

            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task UpdateStudent_ReturnsOk_WhenSuccess()
        {
            _adminServiceMock.Setup(s => s.UpdateStudentAsync(1, It.IsAny<Student>()))
                .ReturnsAsync(new Student());

            var result = await _controller.UpdateStudent(1, new Student());

            Assert.IsType<OkObjectResult>(result);
        }

        // ---------------- DELETE Student ----------------
        [Fact]
        public async Task DeleteStudent_ReturnsBadRequest_WhenInvalidId()
        {
            var result = await _controller.DeleteStudent(0);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task DeleteStudent_ReturnsNotFound_WhenMissing()
        {
            var response = new { message = "Student not found." };

            _adminServiceMock.Setup(s => s.DeleteStudentAsync(1))
                .ReturnsAsync(response);

            var result = await _controller.DeleteStudent(1);

            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task DeleteStudent_ReturnsOk_WhenDeleted()
        {
            _adminServiceMock.Setup(s => s.DeleteStudentAsync(1))
                .ReturnsAsync(new { message = "Deleted successfully" });

            var result = await _controller.DeleteStudent(1);

            Assert.IsType<OkObjectResult>(result);
        }

        // ---------------- GET ByEmail ----------------
        [Fact]
        public async Task GetByEmail_ReturnsBadRequest_WhenEmpty()
        {
            var result = await _controller.getByData("");

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task GetByEmail_ReturnsNotFound_WhenNull()
        {
            _adminServiceMock.Setup(s => s.GetByEmailAsync("abc@gmail.com"))
                .ReturnsAsync((Student)null);

            var result = await _controller.getByData("abc@gmail.com");

            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task GetByEmail_ReturnsOk_WhenFound()
        {
            _adminServiceMock.Setup(s => s.GetByEmailAsync("abc@gmail.com"))
                .ReturnsAsync(new Student());

            var result = await _controller.getByData("abc@gmail.com");

            Assert.IsType<OkObjectResult>(result);
        }

        // ---------------- GET Course Stats ----------------
        [Fact]
        public async Task GetCourseStats_ReturnsOk()
        {
            _adminServiceMock.Setup(s => s.GetCourseStatsAsync())
                .ReturnsAsync(new { Count = 10 });

            var result = await _controller.GetCourseStats();

            Assert.IsType<OkObjectResult>(result);
        }
    }
}
