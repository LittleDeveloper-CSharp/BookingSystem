using BookingSystem.Domain.Enums;

namespace BookingSystem.Domain.Abstractions;

public abstract class SortBase<TEntity> where TEntity : EntityBase
{
    public abstract IQueryable<TEntity> SortBy(IQueryable<TEntity> entities, SortingType sortingType);
}
