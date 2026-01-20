using BookingSystem.Domain.Enums;
using System.Linq.Expressions;

namespace BookingSystem.Domain.Abstractions;

public record FilterSortingBase<T>
{
    public required IReadOnlyCollection<Expression<Func<T, bool>>>? Filters { get; init; }

    public required SortingType? SotringType { get; init; }

    public required Expression<Func<T>>? PropertySort { get; init; }
}
