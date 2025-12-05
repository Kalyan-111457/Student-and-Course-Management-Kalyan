    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using System.Threading.Tasks;
    using UseCaseFinalSubmission.Models;
    using UseCaseFinalSubmission.Services.Interfaces;


    namespace UseCase.Controllers
    {
        [Route("api/[controller]")]
        [ApiController]
        [Authorize(Roles = "Admin")]


        public class AdminController : ControllerBase
        {
            private readonly IAdminService _adminService;

            public AdminController(IAdminService adminService)
            {
                _adminService = adminService;
            }


            [HttpGet("AllStudentEnrollments")]
            public async Task<ActionResult> GetAllStudentEnrollments()
            {
                var result = await _adminService.GetAllStudentEnrollmentsAsync();
                return Ok(result);
            }





            [HttpGet("EnrolledStudentsByCourseId/{courseId:int}")]
            public async Task<ActionResult> GetEnrolledStudentsByCourseId(int courseId)
            {
                var result = await _adminService.GetEnrolledStudentsByCourseIdAsync(courseId);
                if (result == null) return NotFound("Course not found.");
                return Ok(result);
            }





            [HttpGet("AllStudents")]
            public async Task<ActionResult> GetAllStudents()
            {
                var result = await _adminService.GetAllStudentsAsync();
                return Ok(result);
            }



            [HttpPost]
            [Route("StudentRegister")]

            public async Task<ActionResult> CreateRegister([FromBody] Student student)
            {
                try
                {
                    if (!ModelState.IsValid)
                    {
                        var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                        return BadRequest(new { messages = errors });
                    }

                    var result = await _adminService.CreateStudentAsync(student);
                    if (result is { } && result.GetType().GetProperty("message") != null)
                    {
                        var msg = (string)result.GetType().GetProperty("message")!.GetValue(result)!;
                        return BadRequest(new { message = msg });
                    }

                    return Ok(result);
                }
                catch (Exception ex)
                {
                    // Log error
                    return StatusCode(500, new { error = ex.Message });
                }
            }


            [HttpPut("Update/{id:int}")]
            public async Task<ActionResult> UpdateStudent(int id, [FromBody] UseCaseFinalSubmission.Models.Student model)
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                    return BadRequest(new { messages = errors });
                }

                if (id <= 0) return BadRequest("Invalid ID.");

                var result = await _adminService.UpdateStudentAsync(id, model);
                if (result is { } && result.GetType().GetProperty("message") != null)
                {
                    var msg = (string)result.GetType().GetProperty("message")!.GetValue(result)!;
                    if (msg == "Student not found.")
                        return NotFound(msg);
                }

                return Ok(result);
            }





            [HttpDelete("Delete/{id:int}")]
            [AllowAnonymous]
            public async Task<ActionResult> DeleteStudent(int id)
            {
                if (id <= 0) return BadRequest("Invalid ID.");

                var result = await _adminService.DeleteStudentAsync(id);
                if (result is { } && result.GetType().GetProperty("message") != null)
                {
                    var msg = (string)result.GetType().GetProperty("message")!.GetValue(result)!;
                    if (msg == "Student not found.") return NotFound(msg);
                }

                return Ok(result);
            }



            [HttpGet]
            [Route("ByEmail/{email}")]
            [AllowAnonymous]
            public async Task<ActionResult> getByData(string email)
            {
                if (string.IsNullOrEmpty(email))
                    return BadRequest(new { Message = "Email is required" });

                var result = await _adminService.GetByEmailAsync(email);
                if (result == null) return NotFound(new { Message = "No student found for this email" });
                return Ok(result);
            }

        [HttpGet("GetCourseStats")]
        public async Task<IActionResult> GetCourseStats()
        {
            var result = await _adminService.GetCourseStatsAsync();
            return Ok(result);
        }


        }
    }
