using System.Security.Claims;
using MealPlanPlatform.API.DTOs.HealthProfile;
using MealPlanPlatform.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MealPlanPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Need End User To Be Authenticated To Access These Endpoints
    public class HealthProfileController : ControllerBase
    {
        private readonly HealthProfileService _healthProfileService;

        public HealthProfileController(HealthProfileService healthProfileService)
        {
            _healthProfileService = healthProfileService;
        }

        // POST: api/healthprofile
        [HttpPost]
        public async Task<IActionResult> SaveProfile(HealthProfileDto dto)
        {
            // User ID Is Stored In The JWT Token As Claim, So We Extract It From There
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var result = await _healthProfileService.SaveProfile(userId, dto);
            return Ok(result);
        }

        // GET: api/healthprofile
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var result = await _healthProfileService.GetProfile(userId);

            if (result == null)
                return NotFound(new { message = "There is no health data available for this user." });

            return Ok(result);
        }
    }
}