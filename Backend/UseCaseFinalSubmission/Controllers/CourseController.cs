using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using UseCaseFinalSubmission.Services.Interfaces;

namespace UseCaseFinalSubmission.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _service;

        public CourseController(ICourseService service)
        {
            _service = service;
        }




        [HttpGet]
        [Route("GetAllCourses")]
        [AllowAnonymous]
        public async Task<ActionResult> GetAllCourses()
        {
            var result = await _service.GetAllCoursesAsync();
            return Ok(result);
        }



        [HttpPost]
        [Route("CreateCourse")]
        public async Task<ActionResult> CreateCourses([FromBody] UseCaseFinalSubmission.Models.Course model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(new { messages = errors });
            }

            if (model == null) return BadRequest(new { message = "Invalid Course Data" });

            var result = await _service.CreateCourseAsync(model);
            if (result is { } && result.GetType().GetProperty("message") != null)
            {
                var msg = (string)result.GetType().GetProperty("message")!.GetValue(result)!;
                return BadRequest(new { message = msg });
            }

            return Ok(result);
        }

        [HttpGet]
        [Route("GetCourseById/{id:int}")]
        public async Task<ActionResult> GetCourseById(int id)
        {
            if (id <= 0) return BadRequest("The Id Not Be Null");

            var result = await _service.GetCourseByIdAsync(id);
            if (result == null) return NotFound("The Course Is Not Found");

            return Ok(result);
        }

        [HttpPut]
        [Route("UpdateCourseById/{id:int}")]
        public async Task<ActionResult> UpdateCourse([FromBody] UseCaseFinalSubmission.Models.Course model, int id)
        {
            if (id <= 0) return BadRequest(new { message = "The Id Value BE Not Less Than Zero" });

            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(new { messages = errors });
            }

            var result = await _service.UpdateCourseAsync(id, model);

            if (result is { } && result.GetType().GetProperty("message") != null)
            {
                var msg = (string)result.GetType().GetProperty("message")!.GetValue(result)!;
                return BadRequest(new { message = msg });
            }

            return Ok(result);
        }



        [HttpDelete]
        [Route("DeleteById/{id:int}")]
        public async Task<ActionResult> DeleteByCourse(int id)
        {
            if (id <= 0) return BadRequest("The Id value is Not Less Than Zero");

            var result = await _service.DeleteCourseAsync(id);
            if (result is { } && result.GetType().GetProperty("message") != null)
            {
                var msg = (string)result.GetType().GetProperty("message")!.GetValue(result)!;
                return BadRequest(msg);
            }
            return Ok(result);
        }
    }
}
