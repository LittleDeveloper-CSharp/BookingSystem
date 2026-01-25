using BookingSystem.Application.Intefraces;
using BookingSystem.Domain.Abstractions;
using BookingSystem.Domain.Enums;
using BookingSystem.Infrastructure.Exceptions;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BookingSystem.Infrastructure.Services;

internal sealed class GenericRepository<T>(AppDbContext appDbContext) : IGenericRepository<T>
    where T : EntityBase
{
    private readonly DbSet<T> _set = appDbContext.Set<T>();

    public async Task CreateAsync(T entity, CancellationToken cancellationToken = default)
    {
        await _set.AddAsync(entity, cancellationToken);
    }

    public void Delete(T entity)
    {
        entity.IsDeleted = true;

        Update(entity);
    }

    public async Task<T> GetAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _set.FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new NotFoundException();
    }

    public async Task<TSelect> GetAsync<TSelect>(int id, Expression<Func<T, TSelect>> select, CancellationToken cancellationToken = default)
    {
        return await _set.Where(x => x.Id == id)
            .Select(select)
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new NotFoundException();
    }

    public async Task<IReadOnlyCollection<TSelect>> GetAsync<TSelect>(
        Expression<Func<T, TSelect>> select, 
        FilterSortingBase<T>? filters = null, 
        CancellationToken cancellationToken = default)
    {
        var query = _set.AsQueryable();
        if (filters != null)
        {
            if (filters.Filters != null)
                foreach (var filter in filters.Filters)
                    query = query.Where(filter);

            if (filters.SortingType != null
                && filters.PropertySort != null)
                query = filters.PropertySort.SortBy(query, filters.SortingType.Value);
        }

        return await query.Select(select)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyCollection<TSelect>> GetAsync<TSelect>(Expression<Func<T, bool>> predicate, Expression<Func<T, TSelect>> select, CancellationToken cancellationToken = default)
    {
        return await _set.Where(predicate)
            .Select(select)
            .ToListAsync(cancellationToken);
    }

    public void Update(T entity)
    {
        _set.Update(entity);
    }
}
