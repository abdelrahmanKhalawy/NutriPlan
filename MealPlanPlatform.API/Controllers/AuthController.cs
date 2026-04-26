using MealPlanPlatform.API.DTOs.Auth;
using MealPlanPlatform.API.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace MealPlanPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly IHttpClientFactory _httpClientFactory;

        public AuthController(AuthService authService, IHttpClientFactory httpClientFactory)
        {
            _authService = authService;
            _httpClientFactory = httpClientFactory;
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

        // POST: api/auth/google-login
        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto dto)
        {
            try
            {
                // جيب الـ user info من Google باستخدام الـ access_token
                var client = _httpClientFactory.CreateClient();
                client.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", dto.IdToken);

                var response = await client.GetAsync("https://www.googleapis.com/oauth2/v3/userinfo");

                if (!response.IsSuccessStatusCode)
                    return Unauthorized(new { message = "Invalid Google token." });

                var json = await response.Content.ReadAsStringAsync();
                var userInfo = JsonSerializer.Deserialize<JsonElement>(json);

                var email = userInfo.GetProperty("email").GetString()!;
                var name = userInfo.GetProperty("name").GetString()!;

                var result = await _authService.GoogleLogin(email, name);

                if (result == null)
                    return BadRequest(new { message = "Google login failed." });

                return Ok(result);
            }
            catch
            {
                return Unauthorized(new { message = "Google login failed." });
            }
        }
    }
}