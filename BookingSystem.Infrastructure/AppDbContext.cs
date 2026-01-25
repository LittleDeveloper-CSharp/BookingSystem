using BookingSystem.Domain.Abstractions;
using BookingSystem.Domain.Entities;
using BookingSystem.Infrastructure.Configurations;
using BookingSystem.Infrastructure.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BookingSystem.Infrastructure;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<User, IdentityRole, string>(options)
{
    public DbSet<Hotel> Hotels => Set<Hotel>();

    public DbSet<Room> Rooms => Set<Room>();

    public DbSet<Booking> Bookings => Set<Booking>();

    public DbSet<Client> Clients => Set<Client>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfiguration(new UserConfiguration());
        builder.ApplyConfiguration(new RoleConfiguration());
        builder.ApplyConfiguration(new UserRoleConfiguration());

        builder.Entity<Hotel>()
            .HasQueryFilter(x => !x.IsDeleted);

        builder.Entity<Room>()
            .HasQueryFilter(x => !x.IsDeleted);

        builder.Entity<Booking>()
            .HasQueryFilter(x => !x.IsDeleted);

        builder.Entity<Client>()
            .HasQueryFilter(x => !x.IsDeleted);


        base.OnModelCreating(builder);
    }
}
