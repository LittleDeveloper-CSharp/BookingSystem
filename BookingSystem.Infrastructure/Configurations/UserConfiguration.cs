using BookingSystem.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookingSystem.Infrastructure.Configurations;

internal sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        // Статический хэш для пароля "Admin123"
        var passwordHash = "AQAAAAIAAYagAAAAEIGi2vnj7FTC/wDmzHscgK9eAh+8G9eOKj2qKsVramcKcP4VlG2U0lCcstv+cpcVJA==";
        var user = new User
        {
            Id = "admin-1",
            UserName = "admin",
            Email = "admin@admin.com",
            NormalizedEmail = "ADMIN@ADMIN.COM",
            EmailConfirmed = true,
            SecurityStamp = "a7c1813c-c458-4061-9f5a-b3284ac1ce61",
            ConcurrencyStamp = "79f18e72-5a38-42f3-9898-9048bc5b6520",
            PasswordHash = passwordHash
        };

        builder.HasData(user);
    }
}
