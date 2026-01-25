using BookingSystem.Application.Intefraces;
using BookingSystem.Application.Models.FilterSortings;
using BookingSystem.Application.Models.Hotels;
using BookingSystem.Domain.Entities;
using BookingSystem.Infrastructure.Interfaces;
using BookingSystem.Infrastructure.Models.Reports;
using BookingSystem.Server.Models.Hotels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookingSystem.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class HotelsController(
    IHotelService hotelService,
    IReportService<HotelStatisticDto, Hotel> reportService) : ControllerBase
{
    private readonly IHotelService _hotelService = hotelService;

    private readonly IReportService<HotelStatisticDto, Hotel> _reportService = reportService;

    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] HotelFilters? hotelFilters = null,
        [FromQuery] HotelSorting? sortings = null,
        CancellationToken cancellationToken = default)
    {
        var filter = new HotelFilterSortingDto
        {
            Filters = hotelFilters?.GetFilters(),
            PropertySort = sortings?.GetSorting(),
            SortingType = sortings?.SortOrder
        };

        var response = await _hotelService.GetHotelCartsAsync(filter, cancellationToken);

        return Ok(response);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(
        [FromRoute] int id,
        CancellationToken cancellationToken = default)
    {
        var response = await _hotelService.GetHotelDetailsAsync(id, cancellationToken);

        return Ok(response);
    }

    [HttpPost]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> Create(
        [FromBody] CreateHotelDto createHotel,
        CancellationToken cancellationToken = default)
    {
        var id = await _hotelService.CreateHotelAsync(createHotel, cancellationToken);

        return CreatedAtAction(nameof(Get), new { id }, new { id });
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> Update(
        [FromRoute] int id,
        UpdateHotelDto updateHotel,
        CancellationToken cancellationToken = default)
    {
        await _hotelService.UpdateHotelAsync(id, updateHotel, cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> Delete(
        [FromRoute] int id,
        CancellationToken cancellationToken = default)
    {
        await _hotelService.DeleteHotelAsync(id, cancellationToken);

        return NoContent();
    }

    [HttpGet("report")]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> GetReport(
        [FromQuery] HotelFilters? hotelFilters = null,
        CancellationToken cancellationToken = default)
    {
        var filter = new HotelFilterSortingDto
        {
            Filters = hotelFilters?.GetFilters(),
            PropertySort = null,
            SortingType = null
        };

        var report = await _reportService.GetReportAsync(
            ["Наименование", "Количество свободных комнат"],
            x => new HotelStatisticDto
            {
                CountBooking = x.Rooms.Count(x => x.Bookings.Count != 0),
                Name = x.Name
            }, filter, cancellationToken);

        return File(report, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Report.xlsx");
    }
}
