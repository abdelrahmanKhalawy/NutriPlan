using System.Security.Claims;
using MealPlanPlatform.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MealPlanPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MealPlanController : ControllerBase
    {
        private readonly MealPlanService _mealPlanService;

        public MealPlanController(MealPlanService mealPlanService)
        {
            _mealPlanService = mealPlanService;
        }

        // POST: api/mealplan/generate
        [HttpPost("generate")]
        public async Task<IActionResult> Generate()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var plan = await _mealPlanService.GenerateMealPlan(userId);
            return Ok(new
            {
                message = "Meal plan generated successfully!",
                totalDays = 30,
                totalMeals = plan.Count
            });
        }

        // GET: api/mealplan/day/1
        [HttpGet("day/{day}")]
        public async Task<IActionResult> GetDay(int day)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var meals = await _mealPlanService.GetDayPlan(userId, day);

            if (!meals.Any())
                return NotFound(new { message = "No plan found for this day" });

            return Ok(new
            {
                day,
                meals,
                totalCalories = meals.Sum(m => m.Calories)
            });
        }

        // GET: api/mealplan/full
        [HttpGet("full")]
        public async Task<IActionResult> GetFull()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var plan = await _mealPlanService.GetFullPlan(userId);

            if (!plan.Any())
                return NotFound(new { message = "No meal plan found, please generate one first" });

            return Ok(plan);
        }
    }
}