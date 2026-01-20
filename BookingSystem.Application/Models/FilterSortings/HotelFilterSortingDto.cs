using BookingSystem.Domain.Abstractions;
using BookingSystem.Domain.Entities;

namespace BookingSystem.Application.Models.FilterSortings;

public sealed record HotelFilterSortingDto : FilterSortingBase<Hotel>
{
}
