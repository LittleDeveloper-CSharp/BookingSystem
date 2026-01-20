using BookingSystem.Domain.Enums;

namespace BookingSystem.Domain.Entities;

public class User
{
    public int Id { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? Patronymic { get; set; }

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public RoleType Role { get; set; }
}
