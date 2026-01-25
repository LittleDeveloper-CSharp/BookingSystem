using BookingSystem.Application.Intefraces;
using BookingSystem.Domain.Abstractions;
using BookingSystem.Infrastructure.Interfaces;
using BookingSystem.Infrastructure.Models.Reports;
using OfficeOpenXml;
using System.Linq.Expressions;

namespace BookingSystem.Infrastructure.Services;

internal sealed class ReportService<T, TEntity>(IUnifOfWork unifOfWork) : IReportService<T, TEntity>
    where T : ReportRowBase
    where TEntity : EntityBase
{
    private readonly IGenericRepository<TEntity> _genericRepository = unifOfWork.GetRepository<TEntity>();

    public async Task<byte[]> GetReportAsync(
        IReadOnlyCollection<string> headers,
        Expression<Func<TEntity, T>> select,
        FilterSortingBase<TEntity>? filterSorting = null,
        CancellationToken cancellationToken = default)
    {
        var rows = await _genericRepository.GetAsync(select, filterSorting, cancellationToken);

        using var p = new ExcelPackage();
        var ws = p.Workbook.Worksheets.Add("Отчет");

        var counter = 1;

        for (int i = 0; i < headers.Count; i++)
            ws.Cells[counter, i + 1].Value = headers.ElementAt(i);

        counter++;

        foreach (var row in rows)
        {
            var value = row.GetRowValues();
            for (int i = 0; i < value.Length; i++)
                ws.Cells[counter, i + 1].Value = value[i];

            counter++;
        }

        return p.GetAsByteArray();
    }
}
