namespace BookingSystem.Infrastructure.Models.Reports;

public sealed record RoomStatisticDto : ReportRowBase
{
    public required string Name { get; init; }

    public required int CountBooking { get; init; }

    public override string[] GetRowValues()
    {
        return [Name, CountBooking.ToString()];
    }
}
