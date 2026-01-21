using BookingSystem.Infrastructure.Entities;
using BookingSystem.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BookingSystem.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController(SignInManager<User> signInManager) : ControllerBase
{
    private readonly SignInManager<User> _signInManager = signInManager;

    [HttpPost]
    public async Task<IActionResult> SignIn(
        [FromForm] SignInDto signIn,
        string? returnUrl = null)
    {
        var response = await _signInManager.PasswordSignInAsync(
            signIn.Login,
            signIn.Password,
            true,
            false);

        if (!response.Succeeded)
            return Forbid();

        return Redirect(returnUrl ?? "/");
    }

    [Authorize]
    public async Task<IActionResult> SingOut()
    {
        await _signInManager.SignOutAsync();

        return NoContent();
    }
}
