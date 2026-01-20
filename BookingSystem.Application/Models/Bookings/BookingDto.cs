namespace BookingSystem.Application.Models.Bookings;

public sealed record BookingDto
{
    public required DateOnly StartDate { get; set; }

    public required DateOnly EndDate { get; set; }
}
