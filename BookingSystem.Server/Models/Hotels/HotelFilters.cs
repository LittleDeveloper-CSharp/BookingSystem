using BookingSystem.Domain.Entities;
using System.Linq.Expressions;

namespace BookingSystem.Server.Models.Hotels;

public class HotelFilters
{
    public string? Name { get; init; }

    public int? MinPerson { get; init; }

    public int? MaxPerson { get; init; }

    public IReadOnlyCollection<Expression<Func<Hotel, bool>>> GetFilters()
    {
        var filters = new List<Expression<Func<Hotel, bool>>>();
        if (!string.IsNullOrEmpty(Name))
            filters.Add((x) => x.Name.Contains(Name));

        if (MinPerson != null)
            filters.Add((x) => x.Rooms.Any(x => MinPerson <= x.MaxPerson));

        if (MaxPerson != null)
            filters.Add((x) => x.Rooms.Any(x => MaxPerson >= x.MaxPerson));

        return filters;
    }
}
