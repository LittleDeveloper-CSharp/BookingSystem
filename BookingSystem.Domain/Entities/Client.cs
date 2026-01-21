using BookingSystem.Domain.Abstractions;

namespace BookingSystem.Domain.Entities;

public class Client : EntityBase
{
    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? Patronymic { get; set; }

    public string Email { get; set; } = null!;
}
