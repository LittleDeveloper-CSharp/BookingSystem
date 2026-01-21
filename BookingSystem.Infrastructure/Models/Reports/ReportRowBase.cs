namespace BookingSystem.Infrastructure.Models.Reports;

public abstract record ReportRowBase
{
    public abstract string[] GetRowValues();
}
