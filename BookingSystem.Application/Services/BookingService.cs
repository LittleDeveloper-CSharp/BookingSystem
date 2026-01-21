using BookingSystem.Application.Intefraces;
using BookingSystem.Application.Models.Bookings;
using BookingSystem.Domain.Entities;

namespace BookingSystem.Application.Services;

internal sealed class BookingService(IUnifOfWork unifOfWork) : IBookingService
{
    private readonly IUnifOfWork _unifOfWork = unifOfWork;

    private readonly IGenericRepository<Booking> _genericRepository = unifOfWork.GetRepository<Booking>();

    public async Task<int> CreateBookingAsync(int userId, int roomId, CreateBookingDto createBooking, CancellationToken cancellationToken = default)
    {
        var entity = new Booking
        {
            UserId = userId,
            RoomId = roomId,
            EndDate = createBooking.EndDate,
            StartDate = createBooking.StartDate,
        };

        var id = await _genericRepository.CreateAsync(entity, cancellationToken);

        await _unifOfWork.SaveChangesAsync(cancellationToken);

        return id;
    }

    public async Task DeleteBookingAsync(int bookingId, CancellationToken cancellationToken = default)
    {
        var booking = await _genericRepository.GetAsync(bookingId, cancellationToken);

        _genericRepository.Delete(booking);

        await _unifOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task<BookingDto> GetBookingAsync(int bookingId, CancellationToken cancellationToken = default)
    {
        var dto = await _genericRepository.GetAsync(bookingId,
            x => new BookingDto
            {
                EndDate = x.EndDate,
                StartDate = x.StartDate,
            },
            cancellationToken);

        return dto;
    }
}
