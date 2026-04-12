using System.Security.Claims;
using MealPlanPlatform.API.DTOs.Progress;
using MealPlanPlatform.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MealPlanPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProgressController : ControllerBase
    {
        private readonly ProgressService _progressService;

        public ProgressController(ProgressService progressService)
        {
            _progressService = progressService;
        }

        // POST: api/progress
        [HttpPost]
        public async Task<IActionResult> AddProgress(ProgressDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _progressService.AddProgress(userId, dto);
            return Ok(result);
        }

        // GET: api/progress
        [HttpGet]
        public async Task<IActionResult> GetProgress()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _progressService.GetProgress(userId);

            if (!result.Any())
                return NotFound(new { message = "No progress records yet" });

            return Ok(result);
        }

        // GET: api/progress/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _progressService.GetSummary(userId);
            return Ok(result);
        }
    }
}