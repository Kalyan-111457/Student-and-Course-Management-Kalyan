using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using UseCaseFinalSubmission.Validations;

namespace UseCaseFinalSubmission.Models
{
    [CourseValidation]
    public class Course
    {
        [Key]
        public int CourseId { get; set; }

        [StringLength(50)]

        public string CourseName { get; set; }

        public string CourseDescription { get; set; }

        [Range(1,1000)]
        public int Capacity { get; set; }

        public int AvailableSeats { get; set; } =0;

        public int EnrolledCount { get; set; } = 0;

        [JsonIgnore]
        public ICollection<Enrollement> Enrollements { get; set; } = new List<Enrollement>();






    }
}
