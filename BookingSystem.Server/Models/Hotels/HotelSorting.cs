using BookingSystem.Domain.Abstractions;
using BookingSystem.Domain.Entities;

namespace BookingSystem.Server.Models.Hotels;

public sealed record HotelSorting : SortingsBase<Hotel>
{
    private readonly Dictionary<string, SortBase<Hotel>> _properties = new()
    {
        { "name", new Sort<Hotel, string>((x) => x.Name) },
        { "rooms", new Sort<Hotel, int>((x) => x.Rooms.Select(x=> x.MaxPerson).Max()) }
    };

    public override SortBase<Hotel> GetSorting()
    {
        return _properties[SortBy];
    }
}
