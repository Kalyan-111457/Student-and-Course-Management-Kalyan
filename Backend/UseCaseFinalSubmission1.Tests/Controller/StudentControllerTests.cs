using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using UseCaseFinalSubmission.Controllers;
using UseCaseFinalSubmission.Services.Interfaces;
using UseCaseFinalSubmission.Models;
using System.Collections.Generic;

namespace UseCaseFinalSubmission.Tests.Controllers
{
    public class StudentControllerTests
    {
        private readonly Mock<IStudentService> _studentServiceMock;
        private readonly Mock<ILogger<StudentController>> _loggerMock;
        private readonly StudentController _controller;

        public StudentControllerTests()
        {
            _studentServiceMock = new Mock<IStudentService>();
            _loggerMock = new Mock<ILogger<StudentController>>();
            _controller = new StudentController(_studentServiceMock.Object, _loggerMock.Object);
        }

        // ---------------- EnrollCourse ----------------

        [Fact]
        public async Task EnrollCourse_ReturnsBadRequest_WhenModelInvalid()
        {
            _controller.ModelState.AddModelError("CourseId", "Required");

            var result = await _controller.EnrollCourse(new EnrollAndUnEroll());

            Assert.IsType<BadRequestObjectResult>(result);
        }


        [Fact]
        public async Task EnrollCourse_ReturnsOk_WhenSuccess()
        {
            var response = new { StudentId = 1, CourseId = 2 };

            _studentServiceMock.Setup(s => s.EnrollCourseAsync(It.IsAny<EnrollAndUnEroll>()))
                .ReturnsAsync(response);

            var result = await _controller.EnrollCourse(new EnrollAndUnEroll());

            Assert.IsType<OkObjectResult>(result);
        }

        // ---------------- UnEnrollCourse ----------------

        [Fact]
        public async Task UnEnrollCourse_ReturnsBadRequest_WhenModelInvalid()
        {
            _controller.ModelState.AddModelError("CourseId", "Required");

            var result = await _controller.UnEnrollCourse(new EnrollAndUnEroll());

            Assert.IsType<BadRequestObjectResult>(result);
        }


        

        [Fact]
        public async Task UnEnrollCourse_ReturnsOk_WhenSuccess()
        {
            var response = new { StudentId = 1, CourseId = 2 };

            _studentServiceMock.Setup(s => s.UnEnrollCourseAsync(It.IsAny<EnrollAndUnEroll>()))
                .ReturnsAsync(response);

            var result = await _controller.UnEnrollCourse(new EnrollAndUnEroll());

            Assert.IsType<OkObjectResult>(result);
        }

        // ---------------- GetMyEnrollements ----------------

        [Fact]
        public async Task GetMyEnrollements_ReturnsBadRequest_WhenIdInvalid()
        {
            var result = await _controller.GetMyEnrollements(0);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("The id is Not Less Than The Zero", badRequest.Value);
        }

        [Fact]
        public async Task GetMyEnrollements_ReturnsBadRequest_WhenServiceReturnsMessage()
        {
            var response = new { message = "No enrollments found" };

            _studentServiceMock.Setup(s => s.GetMyEnrollementsAsync(1))
                .ReturnsAsync(response);

            var result = await _controller.GetMyEnrollements(1);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("No enrollments found", badRequest.Value);
        }

        [Fact]
        public async Task GetMyEnrollements_ReturnsOk_WhenSuccess()
        {
            var response = new List<object> { new { CourseId = 1, CourseName = "Math" } };

            _studentServiceMock.Setup(s => s.GetMyEnrollementsAsync(1))
                .ReturnsAsync(response);

            var result = await _controller.GetMyEnrollements(1);

            Assert.IsType<OkObjectResult>(result);
        }
    }
}
