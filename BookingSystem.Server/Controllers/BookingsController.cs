using BookingSystem.Application.Intefraces;
using BookingSystem.Application.Models.Bookings;
using Microsoft.AspNetCore.Mvc;

namespace BookingSystem.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BookingsController(IBookingService bookingService) : ControllerBase
{
    private readonly IBookingService _bookingService = bookingService;

    [HttpPost("{roomId:int}")]
    public async Task<IActionResult> Create(
        [FromRoute] int roomId,
        [FromBody] CreateBookingDto createBookingDto,
        CancellationToken cancellationToken = default)
    {
        var id = _bookingService.CreateBookingAsync(
            0, roomId, createBookingDto, cancellationToken);

        return CreatedAtAction(nameof(Get), null, new { id });
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(
        [FromRoute] int id,
        CancellationToken cancellationToken = default)
    {
        var response = await _bookingService.GetBookingAsync(id, cancellationToken);

        return Ok(response);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(
        [FromRoute] int id,
        CancellationToken cancellationToken = default)
    {
        await _bookingService.DeleteBookingAsync(id, cancellationToken);

        return NoContent();
    }
}
