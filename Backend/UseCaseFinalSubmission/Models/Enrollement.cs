using System.ComponentModel.DataAnnotations.Schema;

namespace UseCaseFinalSubmission.Models
{
    public class Enrollement
    {
        public int EnrollementId { get; set; }

        public Course course { get; set; }

        public Student student { get; set; }


        [ForeignKey(nameof(Course))]  //for Course
        public int CourseId { get; set; }



        [ForeignKey(nameof(Student))] //For Studnet 
        public int StudentId { get; set; }
    }
}
