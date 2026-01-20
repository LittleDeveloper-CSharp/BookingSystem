using BookingSystem.Domain.Entities;
using System.Linq.Expressions;

namespace BookingSystem.Server.Models.Rooms;

public sealed record RoomFilters
{
    public IReadOnlyCollection<Expression<Func<Room, bool>>> GetFilters()
    {
        return [];
    }
}
