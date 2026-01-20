using BookingSystem.Domain.Entities;
using System.Linq.Expressions;

namespace BookingSystem.Server.Models.Hotels;

public class HotelFilters
{

    public IReadOnlyCollection<Expression<Func<Hotel, bool>>> GetFilters()
    {
        return [];
    }
}
