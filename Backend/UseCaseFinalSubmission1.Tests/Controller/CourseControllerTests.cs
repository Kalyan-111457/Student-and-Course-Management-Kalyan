using Xunit;
using Moq;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using UseCaseFinalSubmission.Controllers;
using UseCaseFinalSubmission.Services.Interfaces;

namespace UseCaseFinalSubmission1.Tests.Controller
{
    public class CourseControllerTests
    {
        private readonly Mock<ICourseService> _serviceMock;
        private readonly CourseController _controller;

        public CourseControllerTests()
        {
            _serviceMock = new Mock<ICourseService>();
            _controller = new CourseController(_serviceMock.Object);
        }

        [Fact]
        public async Task GetAllCourses_ShouldReturnOk()
        {
            _serviceMock.Setup(s => s.GetAllCoursesAsync()).ReturnsAsync(new List<object>());

            var result = await _controller.GetAllCourses() as OkObjectResult;

            result.Should().NotBeNull();
            result.StatusCode.Should().Be(200);
        }

        [Fact]
        public async Task CreateCourse_InvalidModel_ShouldReturnBadRequest()
        {
            _controller.ModelState.AddModelError("Name", "Required");

            var result = await _controller.CreateCourses(null);

            result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async Task GetCourseById_NotFound_ShouldReturnNotFound()
        {
            _serviceMock.Setup(s => s.GetCourseByIdAsync(1)).ReturnsAsync((object)null);

            var result = await _controller.GetCourseById(1);

            result.Should().BeOfType<NotFoundObjectResult>();
        }

        [Fact]
        public async Task DeleteCourse_InvalidId_ShouldReturnBadRequest()
        {
            var result = await _controller.DeleteByCourse(0);

            result.Should().BeOfType<BadRequestObjectResult>();
        }
    }
}
