using BookingSystem.Application.Models.Bookings;

namespace BookingSystem.Application.Intefraces;

public interface IBookingService
{
    Task<int> CreateBookingAsync(
        int userId,
        int roomId,
        CreateBookingDto createBooking,
        CancellationToken cancellationToken = default);

    Task<BookingDto> GetBookingAsync(
        int bookingId,
        CancellationToken cancellationToken = default);

    Task DeleteBookingAsync(
        int bookingId,
        CancellationToken cancellationToken = default);
}
