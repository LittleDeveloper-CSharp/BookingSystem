using BookingSystem.Application.Intefraces;
using BookingSystem.Domain.Abstractions;

namespace BookingSystem.Infrastructure.Services;

internal sealed class UnitOfWork(AppDbContext appDbContext) : IUnifOfWork
{
    private readonly AppDbContext _appDbContext = appDbContext;

    private readonly Dictionary<string, object> _repositories = [];

    public IGenericRepository<T> GetRepository<T>() where T : EntityBase
    {
        var key = typeof(T).Name;

        if (_repositories.TryGetValue(key, out object? value))
            return (IGenericRepository<T>)value;
    
        var repository = new GenericRepository<T>(_appDbContext);
        _repositories.Add(key, repository);

        return repository;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _appDbContext.SaveChangesAsync(cancellationToken);
    }
}
