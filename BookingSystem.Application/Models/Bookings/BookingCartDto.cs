namespace BookingSystem.Application.Models.Bookings;

public sealed record BookingCartDto
{
    public required int Id { get; init; }

    public required DateTimeOffset StartDate { get; init; }

    public required DateTimeOffset EndDate { get; init; }

    public required string HotelName { get; init; }

    public required string RoomName { get; init; }
}
