using BookingSystem.Domain.Entities;
using BookingSystem.Infrastructure.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BookingSystem.Infrastructure;

public sealed class AppDbContext : IdentityDbContext<User>
{
    public DbSet<Hotel> Hotels => Set<Hotel>();

    public DbSet<Room> Rooms => Set<Room>();

    public DbSet<Booking> Bookings => Set<Booking>();

    public DbSet<Client> Clients => Set<Client>();
}
