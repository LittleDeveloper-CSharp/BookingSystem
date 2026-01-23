using BookingSystem.Infrastructure.Entities;
using BookingSystem.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BookingSystem.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController(UserManager<User> userManager, 
    IOptions<JwtOptions> options) : ControllerBase
{
    private readonly UserManager<User> _userManager = userManager;

    private readonly IOptions<JwtOptions> _options = options;

    [HttpPost("login")]
    public async Task<IActionResult> SignIn([FromForm] SignInDto signIn)
    {
        var user = await _userManager.FindByEmailAsync(signIn.Login);

        if (user != null && await _userManager.CheckPasswordAsync(user, signIn.Password))
        {
            var token = await GenerateJwtTokenAsync(user);

            return Ok(new
            {
                jwt = token
            });
        }

        return Unauthorized();
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        [FromForm] RegisterDto register)
    {
        var user = await _userManager.FindByNameAsync(register.Login);

        if (user == null)
        {
            user = new User
            {
                UserName = register.Login.Split("@")[0],
                Email = register.Login
            };

            await _userManager.CreateAsync(user, register.Password);
            await _userManager.AddToRoleAsync(user, "Client");

            return NoContent();
        }

        return Conflict();
    }

    private async Task<string> GenerateJwtTokenAsync(User user)
    {
        var roles = await _userManager.GetRolesAsync(user);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.UniqueName, user.UserName ?? string.Empty),
            new(JwtRegisteredClaimNames.Email, user.Email ?? ""),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        foreach (var role in roles)
        {
            claims.Add(new Claim("role", role));
        }

        var userClaims = await _userManager.GetClaimsAsync(user);
        claims.AddRange(userClaims);

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_options.Value.Key
                ?? throw new InvalidOperationException("JWT Key not configured")));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _options.Value.Issuer,
            audience: _options.Value.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
