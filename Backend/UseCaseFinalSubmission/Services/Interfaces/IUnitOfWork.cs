using System.Threading.Tasks;
using UseCaseFinalSubmission.Repository;
using UseCaseFinalSubmission.Models;

namespace UseCaseFinalSubmission.Services.Interfaces
{
    public interface IUnitOfWork
    {
        IGenericRepository<Student> Students { get; }
        IGenericRepository<Course> Courses { get; }
        IGenericRepository<Enrollement> Enrollements { get; }

        Task SaveChangesAsync();
    }
}
