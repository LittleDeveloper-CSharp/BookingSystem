using BookingSystem.Application.Models.Reports;
using BookingSystem.Domain.Abstractions;

namespace BookingSystem.Application.Intefraces;

public interface IReportService<T, TEntity> where T : ReportBaseDto
{
    Task<IReadOnlyCollection<T>> GetReport(
        FilterSortingBase<TEntity>? filterSorting = null,
        CancellationToken cancellationToken = default);
}
