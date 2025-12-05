        using Microsoft.AspNetCore.Authorization;
        using Microsoft.AspNetCore.Mvc;
        using System.Threading.Tasks;
        using UseCaseFinalSubmission.Services.Interfaces;
        using Microsoft.Extensions.Logging;
using UseCaseFinalSubmission.Models;

        namespace UseCaseFinalSubmission.Controllers
        {
            [Route("api/[controller]")]
            [ApiController]
            [Authorize(Roles = "Student")]


            public class StudentController : ControllerBase
            {
                private readonly IStudentService _service;
                private readonly ILogger<StudentController> _logger;

                public StudentController(IStudentService service, ILogger<StudentController> logger)
                {
                    _service = service;
                    _logger = logger;
                }




                [HttpPost]
                [Route("EnrollCourse")]
                public async Task<ActionResult> EnrollCourse([FromBody] EnrollAndUnEroll model)
                {
                    if (!ModelState.IsValid) return BadRequest(ModelState);

                    var result = await _service.EnrollCourseAsync(model);
                    if (result is { } && result.GetType().GetProperty("message") != null)
                    {
                        var msg = (string)result.GetType().GetProperty("message")!.GetValue(result)!;
                        return BadRequest(new { message = msg });
                    }

                    return Ok(result);
                }


                [HttpPost]
                [Route("UnEnrolleCourse")]
                public async Task<ActionResult> UnEnrollCourse([FromBody] EnrollAndUnEroll model)
                {
                    if (!ModelState.IsValid) return BadRequest(ModelState);

                    var result = await _service.UnEnrollCourseAsync(model);
                    if (result is { } && result.GetType().GetProperty("message") != null)
                    {
                        var msg = (string)result.GetType().GetProperty("message")!.GetValue(result)!;
                        return BadRequest(new { message = msg });
                    }

                    return Ok(result);
                }



                [HttpGet]
                [Route("MyEnrollements/{StudentId:int}")]
                [AllowAnonymous]
                public async Task<ActionResult> GetMyEnrollements(int StudentId)
                {
                    if (StudentId <= 0) return BadRequest("The id is Not Less Than The Zero");

                    var result = await _service.GetMyEnrollementsAsync(StudentId);

                    if (result is { } && result.GetType().GetProperty("message") != null)
                    {
                        var msg = (string)result.GetType().GetProperty("message")!.GetValue(result)!;
                        return BadRequest(msg);
                    }

                    return Ok(result);
                }


            }
        }
