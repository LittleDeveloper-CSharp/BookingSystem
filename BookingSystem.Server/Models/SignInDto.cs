namespace BookingSystem.Server.Models;

public sealed record SignInDto
{
    public required string Login { get; init; }

    public required string Password { get; init; }
}
