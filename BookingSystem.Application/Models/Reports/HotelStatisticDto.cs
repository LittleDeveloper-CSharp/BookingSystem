namespace BookingSystem.Application.Models.Reports;

public sealed record HotelStatisticDto : ReportBaseDto
{
    public required string Name { get; init; }

    public required string CountBooking { get; init; }
}
