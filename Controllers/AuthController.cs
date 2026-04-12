using MealPlanPlatform.API.DTOs.Auth;
using MealPlanPlatform.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace MealPlanPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var result = await _authService.Register(dto);

            if (result == null)
                return BadRequest(new { message = "This email already exists!" });

            return Ok(result);
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var result = await _authService.Login(dto);

            if (result == null)
                return Unauthorized(new { message = "The email or password is wrong!" });

            return Ok(result);
        }
    }
}