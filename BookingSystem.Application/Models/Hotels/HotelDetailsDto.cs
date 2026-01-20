using BookingSystem.Application.Models.Rooms;

namespace BookingSystem.Application.Models.Hotels;

public sealed record HotelDetailsDto
{
    public required string Name { get; init; }

    public required string Address { get; init; }
    
    public required string City { get; init; }
}
