using BookingSystem.Application.Intefraces;
using BookingSystem.Infrastructure.Interfaces;
using BookingSystem.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;

namespace BookingSystem.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static void AddInfrastructureLayer(this IServiceCollection serviceDescriptors)
    {
        serviceDescriptors.AddScoped<IUnifOfWork, UnitOfWork>();
        serviceDescriptors.AddTransient(typeof(IReportService<,>), typeof(ReportService<,>));
    }
}
