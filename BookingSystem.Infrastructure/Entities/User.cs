using BookingSystem.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace BookingSystem.Infrastructure.Entities;

public class User : IdentityUser
{
    public int? ClientId { get; set; }

    public Client? Client { get; set; }
}
