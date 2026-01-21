using BookingSystem.Domain.Enums;
using System.Linq.Expressions;

namespace BookingSystem.Server.Models;

public abstract record SortingsBase<T>
{
    public required string Property { get; init; }

    public required SortingType SotringType { get; init; }

    public abstract Expression<Func<T, object>> GetSorting();
}
