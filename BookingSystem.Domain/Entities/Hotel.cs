using BookingSystem.Domain.Abstractions;

namespace BookingSystem.Domain.Entities;

public class Hotel : EntityBase
{
    public string Address { get; set; } = null!;

    public string City { get; set; } = null!;

    public string Name { get; set; } = null!;

    public ICollection<Room> Rooms { get; set; } = new HashSet<Room>();
}
