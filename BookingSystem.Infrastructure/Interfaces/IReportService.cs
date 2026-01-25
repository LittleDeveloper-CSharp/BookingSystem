using BookingSystem.Domain.Abstractions;
using BookingSystem.Infrastructure.Models.Reports;
using System.Linq.Expressions;

namespace BookingSystem.Infrastructure.Interfaces;

public interface IReportService<T, TEntity> where T : ReportRowBase
    where TEntity : EntityBase
{
    Task<byte[]> GetReportAsync(
        IReadOnlyCollection<string> headers,
        Expression<Func<TEntity, T>> select,
        FilterSortingBase<TEntity>? filterSorting = null,
        CancellationToken cancellationToken = default);
}

