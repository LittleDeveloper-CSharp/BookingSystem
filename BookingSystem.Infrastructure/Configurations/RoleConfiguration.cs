using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookingSystem.Infrastructure.Configurations;

internal sealed class RoleConfiguration : IEntityTypeConfiguration<IdentityRole>
{
    public void Configure(EntityTypeBuilder<IdentityRole> builder)
    {
        builder.HasData(new IdentityRole
        {
            Id = "Employee",
            Name = "Employee",
            NormalizedName = "EMPLOYEE",
            ConcurrencyStamp = "bfe43fe2-42b3-449f-97ab-afc177b0fe16",
        }, new IdentityRole
        {
            Id = "Client",
            Name = "Client",
            NormalizedName = "CLIENT",
            ConcurrencyStamp = "c5c55da5-6b27-4fcf-a64f-ff6d95b43f4b",
        });
    }
}
