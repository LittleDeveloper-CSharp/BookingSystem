using BookingSystem.Application.Intefraces;
using BookingSystem.Application.Models.FilterSortings;
using BookingSystem.Application.Models.Hotels;
using BookingSystem.Domain.Entities;

namespace BookingSystem.Application.Services;

internal sealed class HotelService(IUnifOfWork unifOfWork) : IHotelService
{
    private readonly IUnifOfWork _unifOfWork = unifOfWork;

    private readonly IGenericRepository<Hotel> _genericRepository = unifOfWork.GetRepository<Hotel>();

    public async Task<int> CreateHotelAsync(CreateHotelDto createHotel, CancellationToken cancellationToken = default)
    {
        var id = await _genericRepository.CreateAsync(new Hotel
        {
            City = createHotel.City,
            Address = createHotel.Address,
            Name = createHotel.Name
        }, cancellationToken);

        await _unifOfWork.SaveChangesAsync(cancellationToken);

        return id;
    }

    public async Task DeleteHotelAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _genericRepository.GetAsync(id, cancellationToken);

        _genericRepository.Delete(entity);

        await _unifOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyCollection<HotelCartDto>> GetHotelCartsAsync(
        HotelFilterSortingDto? hotelCartFilterSorgting = null,
        CancellationToken cancellationToken = default)
    {
        var response = await _genericRepository.GetAsync(
            x => new HotelCartDto
            {
                CountAvailableRooms = x.Rooms.Count,
                Id = x.Id,
                Name = x.Name
            },
            hotelCartFilterSorgting,
            cancellationToken);

        return response;
    }

    public async Task<HotelDetailsDto> GetHotelDetailsAsync(int id, CancellationToken cancellationToken = default)
    {
        var response = await _genericRepository.GetAsync(
            id,
            x => new HotelDetailsDto
            {
                Address = x.Address,
                City = x.City,
                Name = x.Name
            },
            cancellationToken);

        return response;
    }

    public async Task UpdateHotelAsync(int id, UpdateHotelDto updateHotelDto, CancellationToken cancellationToken = default)
    {
        var entity = await _genericRepository.GetAsync(id, cancellationToken);

        entity.Address = updateHotelDto.Address;
        entity.City = updateHotelDto.City;
        entity.Name = updateHotelDto.Name;

        _genericRepository.Update(entity);

        await _unifOfWork.SaveChangesAsync(cancellationToken);
    }
}
