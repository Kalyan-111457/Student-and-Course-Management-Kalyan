using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using UseCaseFinalSubmission.Services.Interfaces;
using UseCaseFinalSubmission.Database;
using UseCaseFinalSubmission.Models;

namespace UseCaseFinalSubmission.Services
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _context;
        public AdminService(AppDbContext context)
        {

            _context = context;

        }

        public async Task<object> GetAllStudentEnrollmentsAsync()
        {

            var students = await _context.Student
                .Include(s => s.Enrollements)
                .ThenInclude(e => e.course)
                .Select(s => new
                {
                    s.StudentId,
                    StudentName = s.FullName,
                    StudentEmail = s.Email,
                    EnrolledCourses = s.Enrollements.Select(e => new
                    {
                        e.course.CourseId,
                        e.course.CourseName,
                        e.course.Capacity,
                        EnrolledCount = e.course.Enrollements.Count(),
                        AvailableSeats = e.course.Capacity - e.course.Enrollements.Count()
                    })
                }).ToListAsync();

            return students;


        }

        public async Task<object?> GetEnrolledStudentsByCourseIdAsync(int courseId)
        {


            var course = await _context.Course
                .Include(c => c.Enrollements)
                .ThenInclude(e => e.student)
                .FirstOrDefaultAsync(c => c.CourseId == courseId);

            if (course == null) return null;

            var students = course.Enrollements.Select(e => new
            {
                e.student.StudentId,
                e.student.FullName,
                e.student.Email,
                e.student.Phone,
                EnrolledOn = e.student.datetime
            }).ToList();

            int enrolledCount = course.Enrollements.Count();
            int availableSeats = course.Capacity - enrolledCount;

            if (students.Count == 0)
            {
                return new
                {
                    Course = course.CourseName,
                    Capacity = course.Capacity,
                    EnrolledCount = enrolledCount,
                    AvailableSeats = availableSeats,
                    Message = "No students enrolled for this course yet."
                };
            }

            return new
            {
                Course = course.CourseName,
                Capacity = course.Capacity,
                EnrolledCount = enrolledCount,
                AvailableSeats = availableSeats,
                TotalStudents = students.Count,
                Students = students
            };

        }

        public async Task<object> GetAllStudentsAsync()
        {
            var students = await _context.Student.ToListAsync();
            return students;
        }

        public async Task<object> CreateStudentAsync(Student student)
        {
            if (student == null) return new { message = "Invalid Student Data" };

            var existingUser = await _context.Student.FirstOrDefaultAsync(n =>
                n.Email.ToLower() == student.Email.ToLower() || n.Phone.ToLower() == student.Phone.ToLower());

            if (existingUser != null)
                return new { message = "Already This User Has Present" };

            _context.Student.Add(student);
            await _context.SaveChangesAsync();

            return new
            {
                Message = "Student Regsitered Succesfully",
                Student = new
                {
                    student.StudentId,
                    student.Password,
                    student.FullName,
                    student.Email,
                    student.Phone,
                    student.Address,
                }
            };
        }




        public async Task<object> UpdateStudentAsync(int id, Student model)
        {


            var existing = await _context.Student.FindAsync(id);
            if (existing == null) return new { message = "Student not found." };

            existing.FullName = model.FullName;
            existing.Email = model.Email;
            existing.Phone = model.Phone;
            existing.Password = model.Password;
            existing.Address = model.Address;

            _context.Student.Update(existing);
            await _context.SaveChangesAsync();

            return new { Message = "Student updated successfully", Student = existing };


        }


        public async Task<object> DeleteStudentAsync(int id)
        {

            var student = await _context.Student.FindAsync(id);
            if (student == null) return new { message = "Student not found." };

            _context.Student.Remove(student);
            await _context.SaveChangesAsync();

            return new { Message = "Student deleted successfully", DeletedStudent = student };


        }


        public async Task<object?> GetByEmailAsync(string email)
        {


            var student = await _context.Student
                .Where(n => n.Email.ToLower() == email.ToLower())
                .FirstOrDefaultAsync();

            if (student == null) return null;
            return student;

        }



        public async Task<object> GetCourseStatsAsync()
        {


            var totalCourses = await _context.Course.CountAsync();
            var totalStudents = await _context.Student.CountAsync();
            var totalEnrollments = await _context.Enrollements.CountAsync();

            var enrolledIds = await _context.Enrollements.Select(e => e.StudentId).Distinct().ToListAsync();
            var totalEnrolledStudents = enrolledIds.Count;
            var totalNotEnrolledStudents = totalStudents - totalEnrolledStudents;

            var courses = await _context.Course
                .Include(c => c.Enrollements)
                .Select(c => new
                {
                    c.CourseId,
                    c.CourseName,
                    c.Capacity,
                    EnrolledCount = c.Enrollements.Count(),
                    AvailableSeats = c.Capacity - c.Enrollements.Count()
                }).ToListAsync();

            var result = new
            {
                TotalCourses = totalCourses,
                TotalStudents = totalStudents,
                TotalEnrolledStudents = totalEnrolledStudents,
                TotalNotEnrolledStudents = totalNotEnrolledStudents,
                TotalEnrollments = totalEnrollments,
                Courses = courses
            };

            return result;

        }
    }
}
