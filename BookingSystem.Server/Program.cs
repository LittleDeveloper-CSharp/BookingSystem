using BookingSystem.Infrastructure;
using BookingSystem.Infrastructure.Entities;
using BookingSystem.Infrastructure.Extensions;
using BookingSystem.Application.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrastructureLayer();
builder.Services.AddApplicationLayer();

builder.AddNpgsqlDbContext<AppDbContext>("postgres");

builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<User>()
    .AddEntityFrameworkStores<AppDbContext>();

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();

// Add services to the container.
builder.Services.AddProblemDetails();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

app.MapIdentityApi<User>();

// Configure the HTTP request pipeline.
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapDefaultEndpoints();

app.UseFileServer();

app.Run();
