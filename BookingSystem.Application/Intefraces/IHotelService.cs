using BookingSystem.Application.Models.FilterSortings;
using BookingSystem.Application.Models.Hotels;

namespace BookingSystem.Application.Intefraces;

public interface IHotelService
{
    Task<IReadOnlyCollection<HotelCartDto>> GetHotelCartsAsync(
        HotelFilterSortingDto? hotelCartFilterSorgting = null,
        CancellationToken cancellationToken = default);

    Task<HotelDetailsDto> GetHotelDetailsAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<int> CreateHotelAsync(
        CreateHotelDto createHotel,
        CancellationToken cancellationToken = default);

    Task UpdateHotelAsync(
        int id,
        UpdateHotelDto updateHotelDto,
        CancellationToken cancellationToken = default);

    Task DeleteHotelAsync(
        int id,
        CancellationToken cancellationToken = default);
}
