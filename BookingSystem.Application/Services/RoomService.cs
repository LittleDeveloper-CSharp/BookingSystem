using BookingSystem.Application.Intefraces;
using BookingSystem.Application.Models.FilterSortings;
using BookingSystem.Application.Models.Rooms;
using BookingSystem.Domain.Entities;

namespace BookingSystem.Application.Services;

internal sealed class RoomService(IUnifOfWork unifOfWork) : IRoomService
{
    private readonly IUnifOfWork _unifOfWork = unifOfWork;

    private readonly IGenericRepository<Room> _genericRepository = unifOfWork.GetRepository<Room>();

    public async Task<int> CreateRoomAsync(int hotelId, CreateRoomDto createRoom, CancellationToken cancellationToken = default)
    {
        var room = new Room
        {
            Description = createRoom.Description,
            Name = createRoom.Name,
            MaxPerson = createRoom.MaxPerson,
            HotelId = hotelId
        };

        await _genericRepository.CreateAsync(room, cancellationToken);

        await _unifOfWork.SaveChangesAsync(cancellationToken);

        return room.Id;
    }

    public async Task DeleteRoomAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _genericRepository.GetAsync(id, cancellationToken);

        _genericRepository.Delete(entity);

        await _unifOfWork.SaveChangesAsync(cancellationToken);
    }

    public Task<RoomDetailsDto> GetAsync(int id, CancellationToken cancellationToken = default)
    {
        return _genericRepository.GetAsync(id, x => new RoomDetailsDto
        {
            Description = x.Description,
            MaxPerson = x.MaxPerson,
            Name = x.Name,
        }, cancellationToken);
    }

    public async Task<IReadOnlyCollection<RoomCartDto>> GetRoomCartsAsync(int hotelId, RoomFilterSortingDto? roomFilterSorting = null, CancellationToken cancellationToken = default)
    {
        roomFilterSorting ??= new RoomFilterSortingDto()
        {
            Filters = null,
            PropertySort = null,
            SortingType = null
        };

        roomFilterSorting = roomFilterSorting with
        {
            Filters = [.. roomFilterSorting.Filters ?? [], (x) => x.HotelId == hotelId]
        };

        var response = await _genericRepository.GetAsync(
            x => new RoomCartDto
            {
                Description = x.Description,
                Id = x.Id,
                MaxPerson = x.MaxPerson,
                Name = x.Name,
                IsActive = !x.Bookings.Any()
            },
            roomFilterSorting,
            cancellationToken);

        return response;
    }

    public async Task UpdateRoomAsync(int id, UpdateRoomDto updateRoomDto, CancellationToken cancellationToken = default)
    {
        var entity = await _genericRepository.GetAsync(id, cancellationToken);

        entity.Description = updateRoomDto.Description;
        entity.Name = updateRoomDto.Name;
        entity.MaxPerson = updateRoomDto.MaxPerson;

        _genericRepository.Update(entity);

        await _unifOfWork.SaveChangesAsync(cancellationToken);
    }
}
