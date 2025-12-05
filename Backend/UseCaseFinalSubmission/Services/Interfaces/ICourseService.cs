using System.Threading.Tasks;

namespace UseCaseFinalSubmission.Services.Interfaces
{
    public interface ICourseService
    {
        Task<object> GetAllCoursesAsync();
        Task<object> CreateCourseAsync(UseCaseFinalSubmission.Models.Course model);
        Task<object?> GetCourseByIdAsync(int id);
        Task<object> UpdateCourseAsync(int id, UseCaseFinalSubmission.Models.Course model);
        Task<object> DeleteCourseAsync(int id);
    }
}
