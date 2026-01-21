using BookingSystem.Domain.Abstractions;

namespace BookingSystem.Application.Intefraces;

public interface IUnifOfWork
{
    IGenericRepository<T> GetRepository<T>() where T : EntityBase;

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
