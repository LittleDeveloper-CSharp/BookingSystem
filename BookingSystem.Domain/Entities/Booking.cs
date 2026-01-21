using BookingSystem.Domain.Abstractions;

namespace BookingSystem.Domain.Entities;

public class Booking : EntityBase
{
    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public int UserId { get; set; }

    public int RoomId { get; set; }

    public Room Room { get; set; } = null!;

    public Client User { get; set; } = null!;
}
