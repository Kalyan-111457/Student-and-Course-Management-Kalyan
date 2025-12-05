using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using UseCaseFinalSubmission.Database;
using UseCaseFinalSubmission.Models;
using UseCaseFinalSubmission.Services.Interfaces;

namespace UseCaseFinalSubmission.Services
{
    public class StudentService : IStudentService
    {
        private readonly AppDbContext _context;

        public StudentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<object> EnrollCourseAsync(EnrollAndUnEroll model)
        {
            var studentdata = await _context.Student.FirstOrDefaultAsync(n => n.StudentId == model.StudentId1);
            var coursedata = await _context.Course.Include(n => n.Enrollements).FirstOrDefaultAsync(n => n.CourseId == model.CourseId1);

            if (studentdata == null || coursedata == null)
                return new { message = "The Data Has Not Found" };

            int enrolledCount = coursedata.Enrollements.Count();
            int availableSeats = coursedata.Capacity - coursedata.EnrolledCount;

            if (availableSeats <= 0)
                return new { message = $"Course '{coursedata.CourseName}' is already full." };

            bool alreadyEnrolled = await _context.Enrollements.AnyAsync(n => n.StudentId == model.StudentId1 && n.CourseId == model.CourseId1);

            if (alreadyEnrolled)
                return new { message = "Already This Student Enrolled This Course" };

            var obj = new Enrollement()
            {
                StudentId = studentdata.StudentId,
                CourseId = coursedata.CourseId
            };

            _context.Enrollements.Add(obj);
            coursedata.EnrolledCount++;
            coursedata.AvailableSeats = coursedata.Capacity - coursedata.EnrolledCount;

            _context.Course.Update(coursedata);
            await _context.SaveChangesAsync();

            return new
            {
                Message = $"Student '{studentdata.FullName}' successfully enrolled in '{coursedata.CourseName}'.",
                Course = new
                {
                    coursedata.CourseId,
                    coursedata.CourseName,
                    coursedata.Capacity,
                    coursedata.EnrolledCount,
                    coursedata.AvailableSeats
                }
            };
        }

        public async Task<object> UnEnrollCourseAsync(EnrollAndUnEroll model)
        {
            var studentdata = await _context.Student.FirstOrDefaultAsync(n => n.StudentId == model.StudentId1);
            var coursedata = await _context.Course.Include(n => n.Enrollements).FirstOrDefaultAsync(n => n.CourseId == model.CourseId1);

            if (studentdata == null || coursedata == null)
                return new { message = "The Data Has Not Found" };

            var checking = await _context.Enrollements.FirstOrDefaultAsync(n => n.StudentId == model.StudentId1 && n.CourseId == model.CourseId1);

            if (checking == null)
                return new { message = "Student is not enrolled in this course." };

            _context.Enrollements.Remove(checking);

            coursedata.EnrolledCount = coursedata.Enrollements.Count() - 1;
            if (coursedata.EnrolledCount <= 0)
                coursedata.EnrolledCount = 0;

            coursedata.AvailableSeats = coursedata.Capacity - coursedata.EnrolledCount;

            _context.Course.Update(coursedata);
            await _context.SaveChangesAsync();

            return new
            {
                Message = $"Student '{studentdata.FullName}' successfully unrolled in '{coursedata.CourseName}'.",
                Course = new
                {
                    coursedata.CourseId,
                    coursedata.CourseName,
                    coursedata.Capacity,
                    coursedata.EnrolledCount,
                    coursedata.AvailableSeats
                }
            };
        }

        public async Task<object> GetMyEnrollementsAsync(int StudentId)
        {
            var student = await _context.Student
                .Include(n => n.Enrollements)
                .ThenInclude(n => n.course)
                .FirstOrDefaultAsync(n => n.StudentId == StudentId);

            if (student == null)
                return new { message = "The Student Details Was Not Found" };

            var enrollment = student.Enrollements.Select(n => new
            {
                n.course.CourseName,
                n.course.CourseDescription,
                n.course.CourseId,
                n.course.Capacity,
                EnrolledCount = n.course.Enrollements.Count(),
                AvailableSeats = n.course.Capacity - n.course.Enrollements.Count()
            }).ToList();

            if (enrollment.Count == 0)
                return new { Message = "This student has not enrolled in any courses yet." };

            return new
            {
                Student = student.FullName,
                TotalCourses = enrollment.Count,
                EnrolledCourses = enrollment
            };
        }
    }
}
