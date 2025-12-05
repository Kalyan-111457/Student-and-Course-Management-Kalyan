using System.ComponentModel.DataAnnotations;
using UseCaseFinalSubmission.Models;

namespace UseCaseFinalSubmission.Validations
{
    public class CourseValidation:ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {

            var course = (Course)validationContext.ObjectInstance;

            if (!int.TryParse(course.Capacity.ToString(), out _))
            {
                return new ValidationResult("Course capacity must be a whole number (integer).");
            }

            if (course.Capacity < 1)
            {
                return new ValidationResult("Course capacity must be greater than 0.");
            }

            if (course.Capacity < course.EnrolledCount)
            {
                return new ValidationResult("Capacity cannot be less than the enrolled count.");
            }

            return ValidationResult.Success;


        }
    }
}
