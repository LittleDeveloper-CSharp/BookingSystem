using BookingSystem.Domain.Abstractions;
using BookingSystem.Domain.Enums;

namespace BookingSystem.Server.Models;

public abstract record SortingsBase<T> where T : EntityBase
{
    public required string SortBy { get; init; }

    public required SortingType SortOrder { get; init; }

    public abstract SortBase<T> GetSorting();
}
