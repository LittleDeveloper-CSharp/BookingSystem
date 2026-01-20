namespace BookingSystem.Application.Models.Rooms;

public sealed record CreateRoomDto
{
    public required string Name { get; init; }

    public required string? Description { get; init; }

    public required int MaxPerson { get; init; }
}
