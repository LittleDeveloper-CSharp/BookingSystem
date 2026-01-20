using BookingSystem.Application.Intefraces;
using BookingSystem.Application.Models.FilterSortings;
using BookingSystem.Application.Models.Hotels;
using BookingSystem.Server.Models.Hotels;
using Microsoft.AspNetCore.Mvc;

namespace BookingSystem.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class HotelsController(IHotelService hotelService) : ControllerBase
{
    private readonly IHotelService _hotelService = hotelService;

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
            SotringType = sortings?.SotringType
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
    public async Task<IActionResult> Create(
        [FromBody] CreateHotelDto createHotel,
        CancellationToken cancellationToken = default)
    {
        var id = await _hotelService.CreateHotelAsync(createHotel, cancellationToken);

        return CreatedAtAction(nameof(Get), null, new { id });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        [FromRoute] int id,
        UpdateHotelDto updateHotel,
        CancellationToken cancellationToken = default)
    {
        await _hotelService.UpdateHotelAsync(id, updateHotel, cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(
        [FromRoute] int id,
        CancellationToken cancellationToken = default)
    {
        await _hotelService.DeleteHotelAsync(id, cancellationToken);

        return NoContent();
    }
}
