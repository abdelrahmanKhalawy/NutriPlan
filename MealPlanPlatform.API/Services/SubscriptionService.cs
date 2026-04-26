using MealPlanPlatform.API.Data;
using MealPlanPlatform.API.DTOs.Subscription;
using MealPlanPlatform.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MealPlanPlatform.API.Services
{
    public class SubscriptionService
    {
        private readonly AppDbContext _context;

        private readonly Dictionary<string, decimal> _prices = new()
        {
            { "Free",    0m    },
            { "Pro",     25m   },
            { "Premium", 50m   }
        };

        public SubscriptionService(AppDbContext context)
        {
            _context = context;
        }

        // ======= Subscribe =======
        public async Task<Subscription> Subscribe(int userId, SubscriptionDto dto)
        {
            if (!_prices.ContainsKey(dto.PlanType))
                throw new Exception("Invalid plan type. Use: Free, Pro, or Premium");

            // if the user already has an active subscription, we expire it before creating a new one
            var active = await _context.Subscriptions
                .FirstOrDefaultAsync(s => s.UserId == userId && s.Status == "Active");

            if (active != null)
                active.Status = "Expired";

            var subscription = new Subscription
            {
                UserId = userId,
                PlanType = dto.PlanType,
                Price = _prices[dto.PlanType],
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddDays(30),
                Status = "Active"
            };

            _context.Subscriptions.Add(subscription);
            await _context.SaveChangesAsync();
            return subscription;
        }

        // ======= Get Current Subscription =======
        public async Task<Subscription?> GetCurrentSubscription(int userId)
        {
            return await _context.Subscriptions
                .Where(s => s.UserId == userId && s.Status == "Active")
                .OrderByDescending(s => s.StartDate)
                .FirstOrDefaultAsync();
        }

        // ======= Get History =======
        public async Task<List<Subscription>> GetHistory(int userId)
        {
            return await _context.Subscriptions
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.StartDate)
                .ToListAsync();
        }

        // ======= Cancel =======
        public async Task<bool> Cancel(int userId)
        {
            var subscription = await _context.Subscriptions
                .FirstOrDefaultAsync(s => s.UserId == userId && s.Status == "Active");

            if (subscription == null) return false;

            subscription.Status = "Cancelled";
            await _context.SaveChangesAsync();
            return true;
        }

        // ======= Check Access =======
        // This method checks if the user has access to a specific feature based on their current subscription plan.
        public async Task<bool> CanAccess(int userId, string feature)
        {
            var subscription = await GetCurrentSubscription(userId);
            if (subscription == null) return false;

            return feature switch
            {
                // All plans have access to basic meal plans
                "MealPlan" => true,

                // Free plan can only access basic meal plans, no coach access
                "Regenerate" => subscription.PlanType == "Free",

                // Pro and Premium plans have access to coaches, but only Premium has access to specialized coaches
                "Coach" => subscription.PlanType is "Pro" or "Premium",

                // Only Premium plan has access to specialized coaches
                "SpecializedCoach" => subscription.PlanType == "Premium",

                _ => false
            };
        }
    }
}