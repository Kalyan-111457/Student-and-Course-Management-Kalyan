using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UseCaseFinalSubmission.Database;
using UseCaseFinalSubmission.Models;

namespace UseCaseFinalSubmission.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthorizeController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _database;

        public AuthorizeController(IConfiguration configuration, AppDbContext database)
        {
            _configuration = configuration;
            _database = database;
        }

        [HttpPost]
        [Route("Login")]
        public IActionResult Login([FromBody] LoginRequest1 request)
        {
            if (request == null || string.IsNullOrEmpty(request.UserName) || string.IsNullOrEmpty(request.Password))
                return BadRequest(new { message = "Username and Password are required" });

            // Check for student
            var student = _database.Student.FirstOrDefault(s => s.Email == request.UserName && s.Password == request.Password);

            // Check for admin
            var admin = _database.admin.FirstOrDefault(a => a.Email == request.UserName && a.Password == request.Password);

            dynamic user = null;
            string role = "";

            if (student != null)
            {
                user = student;
                role = "Student";
            }
            else if (admin != null)
            {
                user = admin;
                role = "Admin";
            }
            else
            {
                return Unauthorized(new { message = "Invalid UserName or Password" });
            }

            // Generate JWT
            var tokenHandler = new JwtSecurityTokenHandler();

            var key = Encoding.ASCII.GetBytes(_configuration.GetValue<string>("Key"));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, request.UserName),
                    new Claim(ClaimTypes.Role, role)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            var response = new LoginResponse
            {
                UserName = request.UserName,
                token = tokenHandler.WriteToken(token)
            };

            return Ok(response);
        }
    }
}
