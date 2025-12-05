using System.Threading.Tasks;

namespace UseCaseFinalSubmission.Services.Interfaces
{
    public interface IAdminService
    {
        Task<object> GetAllStudentEnrollmentsAsync();
        Task<object?> GetEnrolledStudentsByCourseIdAsync(int courseId);
        Task<object> GetAllStudentsAsync();
        Task<object> CreateStudentAsync(UseCaseFinalSubmission.Models.Student student);
        Task<object> UpdateStudentAsync(int id, UseCaseFinalSubmission.Models.Student model);
        Task<object> DeleteStudentAsync(int id);
        Task<object?> GetByEmailAsync(string email);
        Task<object> GetCourseStatsAsync();
    }
}
