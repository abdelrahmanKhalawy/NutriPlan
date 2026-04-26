using System.Security.Claims;
using MealPlanPlatform.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MealPlanPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Coach")]
    public class CoachController : ControllerBase
    {
        private readonly CoachService _coachService;

        public CoachController(CoachService coachService)
        {
            _coachService = coachService;
        }

        // GET: api/coach/my-users
        [HttpGet("my-users")]
        public async Task<IActionResult> GetMyUsers()
        {
            var coachId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var users = await _coachService.GetMyUsers(coachId);
            return Ok(users);
        }

        // GET: api/coach/user/{userId}/profile
        [HttpGet("user/{userId}/profile")]
        public async Task<IActionResult> GetUserProfile(int userId)
        {
            var coachId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _coachService.GetUserProfile(coachId, userId);

            if (result == null)
                return NotFound(new { message = "User not found or not assigned to you" });

            return Ok(result);
        }

        // GET: api/coach/user/{userId}/mealplan/day/{day}
        [HttpGet("user/{userId}/mealplan/day/{day}")]
        public async Task<IActionResult> GetUserMealPlan(int userId, int day)
        {
            var coachId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _coachService.GetUserMealPlan(coachId, userId, day);

            if (result == null)
                return NotFound(new { message = "User not found or not assigned to you" });

            return Ok(result);
        }

        // GET: api/coach/user/{userId}/progress
        [HttpGet("user/{userId}/progress")]
        public async Task<IActionResult> GetUserProgress(int userId)
        {
            var coachId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _coachService.GetUserProgress(coachId, userId);

            if (result == null)
                return NotFound(new { message = "User not found or not assigned to you" });

            return Ok(result);
        }
    }
}