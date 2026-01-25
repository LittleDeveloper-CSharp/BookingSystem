using BookingSystem.Domain.Entities;
using System.Linq.Expressions;

namespace BookingSystem.Server.Models.Rooms;

public sealed record RoomFilters
{
    public int? MinPerson { get; init; }

    public int? MaxPerson { get; init; }

    public IReadOnlyCollection<Expression<Func<Room, bool>>> GetFilters()
    {
        var filters = new List<Expression<Func<Room, bool>>>();
        if (MinPerson.HasValue)
            filters.Add((x) => MinPerson <= x.MaxPerson);
        if (MaxPerson.HasValue)
            filters.Add((x) => x.MaxPerson <= MaxPerson);

        return filters;
    }
}
