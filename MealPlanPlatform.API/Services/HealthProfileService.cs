using MealPlanPlatform.API.Data;
using MealPlanPlatform.API.DTOs.HealthProfile;
using MealPlanPlatform.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MealPlanPlatform.API.Services
{
    public class HealthProfileService
    {
        private readonly AppDbContext _context;

        public HealthProfileService(AppDbContext context)
        {
            _context = context;
        }

        // =================Create Or Update Profile=================
        public async Task<UserHealthProfile> SaveProfile(int userId, HealthProfileDto dto)
        {
            // Search If Profile Exists For The User
            var existing = await _context.UserHealthProfiles
                .FirstOrDefaultAsync(h => h.UserId == userId);

            if (existing != null)
            {
                // Edit Existing Profile
                existing.Height = dto.Height;
                existing.Weight = dto.Weight;
                existing.Age = dto.Age;
                existing.BloodType = dto.BloodType;
                existing.Diseases = dto.Diseases;
                existing.Allergies = dto.Allergies;
                existing.FavoriteFoods = dto.FavoriteFoods;
                existing.MealsPerDay = dto.MealsPerDay;
                existing.Goal = dto.Goal;

                await _context.SaveChangesAsync();
                return existing;
            }

            // Create New Profile
            var profile = new UserHealthProfile
            {
                UserId = userId,
                Height = dto.Height,
                Weight = dto.Weight,
                Age = dto.Age,
                BloodType = dto.BloodType,
                Diseases = dto.Diseases,
                Allergies = dto.Allergies,
                FavoriteFoods = dto.FavoriteFoods,
                MealsPerDay = dto.MealsPerDay,
                Goal = dto.Goal
            };

            _context.UserHealthProfiles.Add(profile);
            await _context.SaveChangesAsync();
            return profile;
        }

        // =================Get Profile=================
        public async Task<UserHealthProfile?> GetProfile(int userId)
        {
            return await _context.UserHealthProfiles
                .FirstOrDefaultAsync(h => h.UserId == userId);
        }
    }
}