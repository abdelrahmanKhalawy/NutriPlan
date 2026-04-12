using MealPlanPlatform.API.Data;
using MealPlanPlatform.API.DTOs.Progress;
using MealPlanPlatform.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MealPlanPlatform.API.Services
{
    public class ProgressService
    {
        private readonly AppDbContext _context;

        public ProgressService(AppDbContext context)
        {
            _context = context;
        }

        // ======= Add Weekly Progress =======
        public async Task<Progress> AddProgress(int userId, ProgressDto dto)
        {
            var progress = new Progress
            {
                UserId = userId,
                Weight = dto.Weight,
                Week = dto.Week,
                Notes = dto.Notes,
                PhotoUrl = dto.PhotoUrl,
                CreatedAt = DateTime.UtcNow
            };

            _context.Progresses.Add(progress);
            await _context.SaveChangesAsync();
            return progress;
        }

        // ======= Get All Progress =======
        public async Task<List<Progress>> GetProgress(int userId)
        {
            return await _context.Progresses
                .Where(p => p.UserId == userId)
                .OrderBy(p => p.Week)
                .ToListAsync();
        }

        // ======= Get Progress Summary =======
        public async Task<object> GetSummary(int userId)
        {
            var records = await _context.Progresses
                .Where(p => p.UserId == userId)
                .OrderBy(p => p.Week)
                .ToListAsync();

            if (!records.Any())
                return new { message = "No progress records found" };

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