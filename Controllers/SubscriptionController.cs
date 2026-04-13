using System.Security.Claims;
using MealPlanPlatform.API.DTOs.Subscription;
using MealPlanPlatform.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MealPlanPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SubscriptionController : ControllerBase
    {
        private readonly SubscriptionService _subscriptionService;

        public SubscriptionController(SubscriptionService subscriptionService)
        {
            _subscriptionService = subscriptionService;
        }

        // POST: api/subscription
        [HttpPost]
        public async Task<IActionResult> Subscribe(SubscriptionDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            try
            {
                var result = await _subscriptionService.Subscribe(userId, dto);
                return Ok(new
                {
                    message = "Subscribed successfully!",
                    plan = result.PlanType,
                    price = result.Price,
                    startDate = result.StartDate,
                    endDate = result.EndDate,
                    status = result.Status
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/subscription/current
        [HttpGet("current")]
        public async Task<IActionResult> GetCurrent()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _subscriptionService.GetCurrentSubscription(userId);

            if (result == null)
                return NotFound(new { message = "No active subscription found" });

            return Ok(result);
        }

        // GET: api/subscription/history
        [HttpGet("history")]
        public async Task<IActionResult> GetHistory()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _subscriptionService.GetHistory(userId);
            return Ok(result);
        }

        // DELETE: api/subscription/cancel
        [HttpDelete("cancel")]
        public async Task<IActionResult> Cancel()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _subscriptionService.Cancel(userId);

            if (!result)
                return NotFound(new { message = "No active subscription to cancel" });

            return Ok(new { message = "Subscription cancelled successfully" });
        }
    }
}