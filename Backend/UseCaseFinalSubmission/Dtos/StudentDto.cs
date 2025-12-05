using System.ComponentModel.DataAnnotations;

namespace UseCaseFinalSubmission.DTOs
{
    public class StudentDto
    {
        [Required]
        public string FullName { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required, Phone]
        public string Phone { get; set; }

        [Required]
        public string Address { get; set; }

        public string Role { get; set; } = "Student";
    }
}
