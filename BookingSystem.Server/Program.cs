using BookingSystem.Application.Extensions;
using BookingSystem.Infrastructure;
using BookingSystem.Infrastructure.Entities;
using BookingSystem.Infrastructure.Extensions;
using BookingSystem.Server.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OfficeOpenXml;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


ExcelPackage.License.SetNonCommercialPersonal("Pavel");

builder.Services.AddInfrastructureLayer();
builder.Services.AddApplicationLayer();
builder.Services.AddCors(opts =>
opts.AddDefaultPolicy(x =>
    x.AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod()
));
builder.AddNpgsqlDbContext<AppDbContext>("postgres");

builder.Services.AddIdentityCore<User>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;

    // Отключаем требование подтверждения email
    options.SignIn.RequireConfirmedEmail = false;
    options.SignIn.RequireConfirmedAccount = false;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<AppDbContext>()
.AddSignInManager<SignInManager<User>>()
.AddRoleManager<RoleManager<IdentityRole>>()
.AddDefaultTokenProviders();

var jwtSection = builder.Configuration.GetSection(JwtOptions.SECTION);
builder.Services.Configure<JwtOptions>(jwtSection);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSection[nameof(JwtOptions.Key)]!))
    };
});

builder.Services.Configure<RouteOptions>(opts =>
{
    opts.LowercaseQueryStrings = true;
    opts.LowercaseUrls = true;
});

builder.Services.AddAuthorization();

builder.Services.AddControllers();

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();

// Add services to the container.
builder.Services.AddProblemDetails();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

// Configure the HTTP request pipeline.
app.UseExceptionHandler();

app.UseFileServer();

app.UseRouting();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapDefaultEndpoints();

app.MapControllers();
app.Run();
