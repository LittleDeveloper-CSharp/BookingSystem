namespace BookingSystem.Application.Models.Hotels;

public sealed record HotelCartDto
{
    public required int Id { get; set; }

    public required string Name { get; set; }

    public required int CountAvailableRooms { get; init; }
}
