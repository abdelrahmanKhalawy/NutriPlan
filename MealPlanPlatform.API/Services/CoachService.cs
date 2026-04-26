using MealPlanPlatform.API.Data;
using Microsoft.EntityFrameworkCore;

namespace MealPlanPlatform.API.Services
{
    public class CoachService
    {
        private readonly AppDbContext _context;

        public CoachService(AppDbContext context)
        {
            _context = context;
        }

        // ======= Get Users Assigned to Coach =======
        public async Task<List<object>> GetMyUsers(int coachId)
        {
            return await _context.UserCoaches
                .Where(uc => uc.CoachId == coachId)
                .Include(uc => uc.User)
                .Select(uc => (object)new
                {
                    uc.User.UserId,
                    uc.User.Name,
                    uc.User.Email,
                    uc.User.CreatedAt
                })
                .ToListAsync();
        }

        // ======= Get User Health Profile =======
        public async Task<object?> GetUserProfile(int coachId, int userId)
        {
            // Make sure this user is assigned to this coach
            var isAssigned = await _context.UserCoaches
                .AnyAsync(uc => uc.CoachId == coachId && uc.UserId == userId);

            if (!isAssigned) return null;

            return await _context.UserHealthProfiles
                .Where(h => h.UserId == userId)
                .Select(h => new
                {
                    h.Height,
                    h.Weight,
                    h.Age,
                    h.BloodType,
                    h.Diseases,
                    h.Allergies,
                    h.Goal,
                    h.MealsPerDay
                })
                .FirstOrDefaultAsync();
        }

        // ======= Get User Meal Plan =======
        public async Task<object?> GetUserMealPlan(int coachId, int userId, int day)
        {
            var isAssigned = await _context.UserCoaches
                .AnyAsync(uc => uc.CoachId == coachId && uc.UserId == userId);

            if (!isAssigned) return null;

            var meals = await _context.MealPlans
                .Where(m => m.UserId == userId && m.Day == day)
                .ToListAsync();

            return new
            {
                day,
                meals,
                totalCalories = meals.Sum(m => m.Calories)
            };
        }

        // ======= Get User Progress =======
        public async Task<object?> GetUserProgress(int coachId, int userId)
        {
            var isAssigned = await _context.UserCoaches
                .AnyAsync(uc => uc.CoachId == coachId && uc.UserId == userId);

            if (!isAssigned) return null;

            var records = await _context.Progresses
                .Where(p => p.UserId == userId)
                .OrderBy(p => p.Week)
                .ToListAsync();

            if (!records.Any())
                return new { message = "No progress records yet" };

            var firstWeight = records.First().Weight;
            var lastWeight = records.Last().Weight;
            var totalChange = lastWeight - firstWeight;

            return new
            {
                totalWeeks = records.Count,
                startWeight = firstWeight,
                currentWeight = lastWeight,
                totalChange = Math.Round(totalChange, 1),
                direction = totalChange < 0 ? "Lost" : "Gained",
                records
            };
        }
    }
}