using BookingSystem.Domain.Enums;
using System.Linq.Expressions;

namespace BookingSystem.Domain.Abstractions;

public class Sort<TEntity, TProperty>(Expression<Func<TEntity, TProperty>> func) : SortBase<TEntity>
    where TEntity : EntityBase
{
    public override IQueryable<TEntity> SortBy(IQueryable<TEntity> entities, SortingType sortingType)
    {
        return sortingType == SortingType.Asc ? entities.OrderBy(func)
            : entities.OrderByDescending(func);
    }
}