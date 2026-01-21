using BookingSystem.Domain.Entities;
using System.Linq.Expressions;

namespace BookingSystem.Server.Models.Hotels;

public sealed record HotelSorting : SortingsBase<Hotel>
{
    public override Expression<Func<Hotel, object>> GetSorting()
    {
        throw new NotImplementedException();
    }
}
