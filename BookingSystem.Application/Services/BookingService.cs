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
            EndDate = DateOnly.FromDateTime(createBooking.EndDate.Date),
            StartDate = DateOnly.FromDateTime(createBooking.StartDate.Date),
        };

        await _genericRepository.CreateAsync(entity, cancellationToken);

        await _unifOfWork.SaveChangesAsync(cancellationToken);

        return entity.Id;
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
            x => new 
            {
                x.EndDate,
                x.StartDate,
            },
            cancellationToken);

        return new BookingDto
        {
            EndDate = dto.EndDate.ToDateTime(default),
            StartDate = dto.StartDate.ToDateTime(default)
        };
    }

    public async Task<IReadOnlyCollection<BookingCartDto>> GetBookingsAsync(int userId, CancellationToken cancellationToken = default)
    {
        var dtos = await _genericRepository.GetAsync(x => x.UserId == userId, x => new
        {
            x.Id,
            x.EndDate,
            HotelName = x.Room.Hotel.Name,
            RoomName = x.Room.Name,
            x.StartDate
        }, cancellationToken);

        return dtos.Select(x => new BookingCartDto
        {
            EndDate = x.EndDate.ToDateTime(default),
            HotelName = x.HotelName,
            Id = x.Id,
            RoomName = x.RoomName,
            StartDate = x.StartDate.ToDateTime(default)
        }).ToList();
    }
}
