using BookingSystem.Domain.Abstractions;
using BookingSystem.Domain.Entities;

namespace BookingSystem.Server.Models.Rooms;

public sealed record RoomSorting : SortingsBase<Room>
{
    private readonly Dictionary<string, SortBase<Room>> _properties = new()
    {
        { "name", new Sort<Room, string>((x) => x.Name) },
        { "maxPerson", new Sort<Room, int>((x) => x.MaxPerson) }
    };

    public override SortBase<Room> GetSorting()
    {
        return _properties[SortBy];
    }
}
