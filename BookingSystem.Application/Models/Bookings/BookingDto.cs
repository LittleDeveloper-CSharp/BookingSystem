namespace BookingSystem.Application.Models.Bookings;

public sealed record BookingDto
{
    public required DateTimeOffset StartDate { get; init; }

    public required DateTimeOffset EndDate { get; init; }
}
