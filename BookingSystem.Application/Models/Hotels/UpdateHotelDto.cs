namespace BookingSystem.Application.Models.Hotels;

public sealed record UpdateHotelDto
{
    public required string Name { get; init; }

    public required string Address { get; init; }

    public required string City { get; init; }
}
