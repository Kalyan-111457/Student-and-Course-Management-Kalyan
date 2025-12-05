using System.ComponentModel.DataAnnotations;

namespace UseCaseFinalSubmission.DTOs
{
    public class CourseDto
    {
        [Required]
        [StringLength(50)]
        public string CourseName { get; set; }


        [Required]
        public string CourseDescription { get; set; }


        [Required]
        [Range(1, 1000)]
        public int Capacity { get; set; }
    }
}
