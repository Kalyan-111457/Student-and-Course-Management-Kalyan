using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using UseCaseFinalSubmission.Database;
using UseCaseFinalSubmission.Models;
using UseCaseFinalSubmission.Services.Interfaces;

namespace UseCaseFinalSubmission.Services
{
    public class CourseService : ICourseService
    {
        private readonly AppDbContext _context;

        public CourseService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<object> GetAllCoursesAsync()
        {
            var courses = await _context.Course
                .Include(c => c.Enrollements)
                .Select(c => new
                {
                    c.CourseId,
                    c.CourseName,
                    c.CourseDescription,
                    c.Capacity,
                    EnrolledCount = c.Enrollements.Count(),
                    AvailableSeats = c.Capacity - c.Enrollements.Count()
                }).ToListAsync();

            return courses;
        }

        public async Task<object> CreateCourseAsync(Course model)
        {
            if (model == null)
                return new { message = "Invalid Course Data" };

            var courseExists = await _context.Course.AnyAsync(n => n.CourseName.ToLower() == model.CourseName.ToLower());
            if (courseExists)
                return new { message = "Already The Course Exists" };

            model.EnrolledCount = 0;
            model.AvailableSeats = model.Capacity;

            _context.Course.Add(model);
            await _context.SaveChangesAsync();

            return new { Message = "Course created successfully", Course = model };
        }

        public async Task<object?> GetCourseByIdAsync(int id)
        {
            var course = await _context.Course.Where(n => n.CourseId == id).FirstOrDefaultAsync();
            if (course == null) return null;
            return new { Message = "Course is Getting Based on Id", Course = course };
        }

        public async Task<object> UpdateCourseAsync(int id, Course model)
        {
            var existingcourse = await _context.Course.Include(c => c.Enrollements).FirstOrDefaultAsync(n => n.CourseId == id);
            if (existingcourse == null) return new { message = "No Course Has Found In It" };

            int enrolledCount = existingcourse.Enrollements.Count();

            if (model.Capacity < enrolledCount)
            {
                return new
                {
                    message = $"Capacity cannot be less than the number of enrolled students ({enrolledCount})."
                };
            }

            existingcourse.CourseName = model.CourseName;
            existingcourse.CourseDescription = model.CourseDescription;
            existingcourse.Capacity = model.Capacity;
            existingcourse.EnrolledCount = existingcourse.Enrollements.Count();
            existingcourse.AvailableSeats = existingcourse.Capacity - existingcourse.EnrolledCount;

            _context.Course.Update(existingcourse);
            await _context.SaveChangesAsync();

            return new { message = "Course updated successfully", Course = existingcourse };
        }

        public async Task<object> DeleteCourseAsync(int id)
        {
            var course = await _context.Course.FirstOrDefaultAsync(n => n.CourseId == id);
            if (course == null) return new { message = "No Course Has Found" };

            _context.Course.Remove(course);
            await _context.SaveChangesAsync();

            return new { Message = "Course deleted successfully", DeletedCourse = course };
        }
    }
}
