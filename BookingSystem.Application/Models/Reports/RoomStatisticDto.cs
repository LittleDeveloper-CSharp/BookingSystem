namespace BookingSystem.Application.Models.Reports;

public sealed record RoomStatisticDto : ReportBaseDto
{
    public required string Name { get; init; }

    public required int CountBooking { get; init; }
}
