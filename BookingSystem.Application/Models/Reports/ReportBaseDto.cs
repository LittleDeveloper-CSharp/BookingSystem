namespace BookingSystem.Application.Models.Reports;

public abstract record ReportBaseDto
{
    public required int RowId { get; init; }
}
