using BookingSystem.Application.Intefraces;
using BookingSystem.Application.Models.Bookings;
using BookingSystem.Infrastructure.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BookingSystem.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Client")]
public class BookingsController(IBookingService bookingService, UserManager<User> userManager) : ControllerBase
{
    private readonly IBookingService _bookingService = bookingService;

    private readonly UserManager<User> _userManager = userManager;

    [HttpPost("~/api/rooms/{roomId:int}/[controller]")]
    public async Task<IActionResult> Create(
        [FromRoute] int roomId,
        [FromBody] CreateBookingDto createBookingDto,
        CancellationToken cancellationToken = default)
    {
        var user = await _userManager.GetUserAsync(User);
        var id = _bookingService.CreateBookingAsync(
            user!.ClientId!.Value, roomId, createBookingDto, cancellationToken);

        return CreatedAtAction(nameof(Get), null, new { id });
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken = default)
    {
        var user = await _userManager.GetUserAsync(User);
        var response = await _bookingService.GetBookingsAsync(user!.ClientId!.Value, cancellationToken);

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
