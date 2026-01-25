using BookingSystem.Application.Intefraces;
using BookingSystem.Application.Models.FilterSortings;
using BookingSystem.Application.Models.Rooms;
using BookingSystem.Domain.Entities;
using BookingSystem.Infrastructure.Interfaces;
using BookingSystem.Infrastructure.Models.Reports;
using BookingSystem.Server.Models.Rooms;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookingSystem.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RoomsController(IRoomService roomService, IReportService<RoomStatisticDto, Room> reportService) : ControllerBase
{
    private readonly IRoomService _roomService = roomService;

    private readonly IReportService<RoomStatisticDto, Room> _reportService = reportService;

    [HttpGet("~/api/hotels/{hotelId:int}/rooms")]
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
            SortingType = roomSorting?.SortOrder
        };

        var response = await _roomService.GetRoomCartsAsync(
            hotelId,
            filter,
            cancellationToken);

        return Ok(response);
    }

    [HttpGet("{id:int}")]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> GetDetails(
        [FromRoute] int id,
        CancellationToken cancellationToken = default)
    {
        var response = await _roomService.GetAsync(id, cancellationToken);

        return Ok(response);
    }

    [HttpPost("~/api/hotels/{hotelId:int}/rooms")]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> Create(
        [FromRoute] int hotelId,
        [FromBody] CreateRoomDto createRoomDto,
        CancellationToken cancellationToken = default)
    {
        var id = await _roomService.CreateRoomAsync(hotelId, createRoomDto, cancellationToken);

        return CreatedAtAction(nameof(GetDetails), new { id }, new { id });
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> Delete(
        [FromRoute] int id,
        CancellationToken cancellationToken = default)
    {
        await _roomService.DeleteRoomAsync(id, cancellationToken);

        return NoContent();
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> Update(
        [FromRoute] int id,
        [FromBody] UpdateRoomDto updateRoomDto,
        CancellationToken cancellationToken = default)
    {
        await _roomService.UpdateRoomAsync(id, updateRoomDto, cancellationToken);

        return NoContent();
    }

    [HttpGet("report")]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> GetReport(
    [FromQuery] RoomFilters? roomFilters = null,
    CancellationToken cancellationToken = default)
    {
        var filter = new RoomFilterSortingDto
        {
            Filters = roomFilters?.GetFilters(),
            PropertySort = null,
            SortingType = null
        };

        var report = await _reportService.GetReportAsync(
            ["Наименование", "Количество бронирований"],
            x => new RoomStatisticDto
            {
                CountBooking = x.Bookings.Count,
                Name = x.Name
            }, filter, cancellationToken);

        return File(report, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Report.xlsx");
    }
}
