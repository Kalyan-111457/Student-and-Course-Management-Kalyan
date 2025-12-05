using System.Threading.Tasks;
using UseCaseFinalSubmission.Database;
using UseCaseFinalSubmission.Models;
using UseCaseFinalSubmission.Repository;
using UseCaseFinalSubmission.Services.Interfaces;

namespace UseCaseFinalSubmission.Services
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        public IGenericRepository<Student> Students { get; }
        public IGenericRepository<Course> Courses { get; }
        public IGenericRepository<Enrollement> Enrollements { get; }

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
            Students = new GenericRepository<Student>(_context);
            Courses = new GenericRepository<Course>(_context);
            Enrollements = new GenericRepository<Enrollement>(_context);
        }

        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }
}
