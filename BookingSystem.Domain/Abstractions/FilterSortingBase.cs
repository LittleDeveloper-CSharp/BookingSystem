using BookingSystem.Domain.Enums;
using System.Linq.Expressions;

namespace BookingSystem.Domain.Abstractions;

public record FilterSortingBase<T> where T : EntityBase
{
    public required IReadOnlyCollection<Expression<Func<T, bool>>>? Filters { get; init; }

    public required SortingType? SortingType { get; init; }

    public required SortBase<T>? PropertySort { get; init; }
}
