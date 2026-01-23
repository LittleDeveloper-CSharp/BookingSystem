namespace BookingSystem.Server.Models;

public sealed record RegisterDto
{
    public required string Login { get; init; }

    public required string Password { get; init; }
}
