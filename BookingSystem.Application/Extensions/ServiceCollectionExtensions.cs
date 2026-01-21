using BookingSystem.Application.Intefraces;
using BookingSystem.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace BookingSystem.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static void AddApplicationLayer(this IServiceCollection serviceProvider)
    {
        serviceProvider.AddTransient<IBookingService, BookingService>();
        serviceProvider.AddTransient<IRoomService, RoomService>();
        serviceProvider.AddTransient<IHotelService, HotelService>();
    }
}
