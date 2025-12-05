using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace UseCaseFinalSubmission.Validations
{
    public class StudentValidation : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var student = (UseCaseFinalSubmission.Models.Student)validationContext.ObjectInstance;

            if (!Regex.IsMatch(student.FullName, @"^[a-zA-Z\s]+$"))
            {
                return new ValidationResult("Full Name must contain only letters.");
            }

            // Validate Password – at least 6 chars, 1 number, 1 uppercase
            if (!Regex.IsMatch(student.Password, @"^(?=.*[A-Z])(?=.*\d).{6,}$"))
            {
                return new ValidationResult("Password must contain min 6 characters, 1 uppercase letter, and 1 digit.");
            }

            if (student.Role != "Student")
            {
                return new ValidationResult("Role must be Student.");
            }

            return ValidationResult.Success;
        }
    }
}
