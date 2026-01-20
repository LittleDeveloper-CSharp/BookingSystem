namespace BookingSystem.Domain.Entities;

public class Booking
{
    public int Id { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public int UserId { get; set; }

    public int RoomId { get; set; }

    public Room Room { get; set; } = null!;

    public User User { get; set; } = null!;
}
