using BookingSystem.Domain.Abstractions;

namespace BookingSystem.Domain.Entities;

public class Room : EntityBase
{
    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public int MaxPerson { get; set; }

    public ICollection<Booking> Bookings { get; set; } = new HashSet<Booking>();
}
