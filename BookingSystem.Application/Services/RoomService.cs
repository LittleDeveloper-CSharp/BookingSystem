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
        var id = await _genericRepository.CreateAsync(new Room
        {
            Description = createRoom.Description,
            Name = createRoom.Name,
            MaxPerson = createRoom.MaxPerson,
        }, cancellationToken);

        await _unifOfWork.SaveChangesAsync(cancellationToken);

        return id;
    }

    public async Task DeleteRoomAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _genericRepository.GetAsync(id, cancellationToken);

        _genericRepository.Delete(entity);

        await _unifOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyCollection<RoomCartDto>> GetRoomCartsAsync(int hotelId, RoomFilterSortingDto? roomFilterSorting = null, CancellationToken cancellationToken = default)
    {
        var response = await _genericRepository.GetAsync(
            x => new RoomCartDto
            {
                Description = x.Description,
                Id = x.Id,
                MaxPerson = x.MaxPerson,
                Name = x.Name,
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
