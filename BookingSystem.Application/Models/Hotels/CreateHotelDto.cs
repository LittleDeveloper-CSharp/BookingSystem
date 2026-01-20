namespace BookingSystem.Application.Models.Hotels;

public sealed record CreateHotelDto
{
    public required string Name { get; init; }

    public required string Address { get; init; }

    public required string City { get; init; }
}
