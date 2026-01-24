using BookingSystem.Application.Models.FilterSortings;
using BookingSystem.Application.Models.Rooms;

namespace BookingSystem.Application.Intefraces;

public interface IRoomService
{
    Task<IReadOnlyCollection<RoomCartDto>> GetRoomCartsAsync(
        int hotelId,
        RoomFilterSortingDto? roomFilterSorting = null,
        CancellationToken cancellationToken = default);

    Task<RoomDetailsDto> GetAsync(int id,
        CancellationToken cancellationToken = default);

    Task<int> CreateRoomAsync(
        int hotelId,
        CreateRoomDto createRoom,
        CancellationToken cancellationToken = default);

    Task UpdateRoomAsync(
        int id,
        UpdateRoomDto updateRoomDto,
        CancellationToken cancellationToken = default);

    Task DeleteRoomAsync(
        int id,
        CancellationToken cancellationToken = default);
}
