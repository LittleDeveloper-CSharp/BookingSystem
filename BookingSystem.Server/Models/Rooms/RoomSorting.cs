using BookingSystem.Domain.Entities;
using System.Linq.Expressions;

namespace BookingSystem.Server.Models.Rooms;

public sealed record RoomSorting : SortingsBase<Room>
{
    public override Expression<Func<Room, object>> GetSorting()
    {
        throw new NotImplementedException();
    }
}
