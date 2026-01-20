namespace BookingSystem.Domain.Entities;

public class Room
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public int MaxPerson { get; set; }
}
