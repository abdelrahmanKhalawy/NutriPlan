using MealPlanPlatform.API.Data;
using MealPlanPlatform.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MealPlanPlatform.API.Services
{
    public class MealPlanService
    {
        private readonly AppDbContext _context;

        public MealPlanService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<MealPlan>> GenerateMealPlan(int userId)
        {
            // 1. Get user health profile
            var profile = await _context.UserHealthProfiles
                .FirstOrDefaultAsync(h => h.UserId == userId);

            if (profile == null)
                throw new Exception("No health profile found for this user");

            // 2. Delete old plan if exists
            var oldPlan = _context.MealPlans.Where(m => m.UserId == userId);
            _context.MealPlans.RemoveRange(oldPlan);

            // 3. Get foods from database
            var allFoods = await _context.Foods.ToListAsync();

            // 4. Filter foods based on allergies
            var allergies = profile.Allergies?.ToLower() ?? "";
            var filteredFoods = allFoods.Where(f =>
            {
                if (allergies.Contains("nuts") && f.Tags.Contains("nuts")) return false;
                if (allergies.Contains("dairy") && f.Tags.Contains("dairy")) return false;
                if (allergies.Contains("fish") && f.Tags.Contains("fish")) return false;
                if (allergies.Contains("gluten") && f.Tags.Contains("gluten")) return false;
                return true;
            }).ToList();

            // 5. Determine meal types based on meals per day
            var mealTypes = profile.MealsPerDay >= 4
                ? new[] { "Breakfast", "Lunch", "Dinner", "Snack" }
                : new[] { "Breakfast", "Lunch", "Dinner" };

            // 6. Generate 30-day plan
            var mealPlan = new List<MealPlan>();
            var random = new Random();

            for (int day = 1; day <= 30; day++)
            {
                foreach (var mealType in mealTypes)
                {
                    var mealsOfType = filteredFoods
                        .Where(f => f.Category == mealType)
                        .ToList();

                    if (!mealsOfType.Any()) continue;

                    var selected = mealsOfType[random.Next(mealsOfType.Count)];

                    mealPlan.Add(new MealPlan
                    {
                        UserId = userId,
                        Day = day,
                        MealType = selected.Category,
                        FoodName = selected.Name,
                        Calories = selected.Calories,
                        Protein = selected.Protein,
                        Carbs = selected.Carbs,
                        Fat = selected.Fat
                    });
                }
            }

            // 7. Save to database
            _context.MealPlans.AddRange(mealPlan);
            await _context.SaveChangesAsync();

            return mealPlan;
        }

        public async Task<List<MealPlan>> GetDayPlan(int userId, int day)
        {
            return await _context.MealPlans
                .Where(m => m.UserId == userId && m.Day == day)
                .ToListAsync();
        }

        public async Task<List<MealPlan>> GetFullPlan(int userId)
        {
            return await _context.MealPlans
                .Where(m => m.UserId == userId)
                .OrderBy(m => m.Day)
                .ToListAsync();
        }
    }
}