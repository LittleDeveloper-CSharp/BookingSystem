namespace BookingSystem.Server.Models;

public sealed record JwtOptions
{
    public const string SECTION = "JWT";

    public required string Issuer { get; init; }

    public required string Audience { get; init; }

    public required string Key { get; init; }
}
