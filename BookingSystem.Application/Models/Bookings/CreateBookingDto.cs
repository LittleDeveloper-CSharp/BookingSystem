namespace BookingSystem.Application.Models.Bookings;

public sealed record CreateBookingDto
{
    public required DateTimeOffset StartDate { get; init; }

    public required DateTimeOffset EndDate { get; init; }
}
