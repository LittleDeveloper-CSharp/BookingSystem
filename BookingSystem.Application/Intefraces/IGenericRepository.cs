using BookingSystem.Domain.Abstractions;
using System.Linq.Expressions;

namespace BookingSystem.Application.Intefraces;

public interface IGenericRepository<T> where T : EntityBase
{
    Task CreateAsync(T entity, 
        CancellationToken cancellationToken = default);
    void Delete(T entity);
    
    Task<T> GetAsync(int id, CancellationToken cancellationToken = default);
    
    Task<TSelect> GetAsync<TSelect>(int id, 
        Expression<Func<T, TSelect>> select, 
        CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<TSelect>> GetAsync<TSelect>(Expression<Func<T, bool>> predicate,
        Expression<Func<T, TSelect>> select,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<TSelect>> GetAsync<TSelect>(Expression<Func<T, TSelect>> select,
        FilterSortingBase<T>? filter = null,
        CancellationToken cancellationToken = default);
    void Update(T entity);
}
