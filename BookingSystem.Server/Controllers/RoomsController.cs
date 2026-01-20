using BookingSystem.Application.Intefraces;
using BookingSystem.Application.Models.FilterSortings;
using BookingSystem.Application.Models.Rooms;
using BookingSystem.Server.Models.Rooms;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace BookingSystem.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RoomsController(IRoomService roomService) : ControllerBase
{
    private readonly IRoomService _roomService = roomService;

    [HttpGet("/api/hotels/{hotelId:int}/rooms")]
    public async Task<IActionResult> Get(
        [FromRoute] int hotelId,
        [FromQuery] RoomFilters? filters = null,
        [FromQuery] RoomSorting? roomSorting = null,
        CancellationToken cancellationToken = default)
    {
        var filter = new RoomFilterSortingDto
        {
            Filters = filters?.GetFilters(),
            PropertySort = roomSorting?.GetSorting(),
            SotringType = roomSorting?.SotringType
        };

        var response = await _roomService.GetRoomCartsAsync(
            hotelId, 
            filter, 
            cancellationToken);

        return Ok(response);
    }

    [HttpPost("/api/hotels/{hotelId:int}/rooms")]
    public async Task<IActionResult> Create(
        [FromRoute] int hotelId,
        [FromBody] CreateRoomDto createRoomDto,
        CancellationToken cancellationToken = default)
    {
        await _roomService.CreateRoomAsync(hotelId, createRoomDto, cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(
        [FromRoute] int id,
        CancellationToken cancellationToken = default)
    {
        await _roomService.DeleteRoomAsync(id, cancellationToken);

        return NoContent();
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        [FromRoute] int id,
        [FromBody] UpdateRoomDto updateRoomDto,
        CancellationToken cancellationToken = default)
    {
        await _roomService.UpdateRoomAsync(id, updateRoomDto, cancellationToken);

        return NoContent();
    }
}
