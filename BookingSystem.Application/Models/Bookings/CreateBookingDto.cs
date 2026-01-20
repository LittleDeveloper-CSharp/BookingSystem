namespace BookingSystem.Application.Models.Bookings;

public sealed record CreateBookingDto
{
    public required DateOnly StartDate { get; set; }

    public required DateOnly EndDate { get; set; }
}
