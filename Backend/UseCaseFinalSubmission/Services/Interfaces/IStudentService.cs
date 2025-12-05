using System.Threading.Tasks;

namespace UseCaseFinalSubmission.Services.Interfaces
{
    public interface IStudentService
    {
        Task<object> EnrollCourseAsync(UseCaseFinalSubmission.Models.EnrollAndUnEroll model);
        Task<object> UnEnrollCourseAsync(UseCaseFinalSubmission.Models.EnrollAndUnEroll model);
        Task<object> GetMyEnrollementsAsync(int studentId);
    }
}
