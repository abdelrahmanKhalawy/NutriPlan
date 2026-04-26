using MealPlanPlatform.API.Data;
using MealPlanPlatform.API.DTOs.Admin;
using MealPlanPlatform.API.Models;
using Microsoft.EntityFrameworkCore;

namespace MealPlanPlatform.API.Services
{
    public class AdminService
    {
        private readonly AppDbContext _context;

        public AdminService(AppDbContext context)
        {
            _context = context;
        }

        // ======= Change User Role =======
        public async Task<bool> AssignRole(AssignRoleDto dto)
        {
            var user = await _context.Users.FindAsync(dto.UserId);
            if (user == null) return false;

            user.Role = dto.Role;
            await _context.SaveChangesAsync();
            return true;
        }

        // ======= Assign Coach to User =======
        public async Task<bool> AssignCoach(AssignCoachDto dto)
        {
            // Make sure both exist
            var user = await _context.Users.FindAsync(dto.UserId);
            var coach = await _context.Users.FindAsync(dto.CoachId);

            if (user == null || coach == null) return false;
            if (coach.Role != "Coach") return false;

            // Check if already assigned
            var existing = await _context.UserCoaches
                .FirstOrDefaultAsync(uc =>
                    uc.UserId == dto.UserId &&
                    uc.CoachId == dto.CoachId);

            if (existing != null) return false;

            _context.UserCoaches.Add(new UserCoach
            {
                UserId = dto.UserId,
                CoachId = dto.CoachId
            });

            await _context.SaveChangesAsync();
            return true;
        }

        // ======= Get All Users =======
        public async Task<List<object>> GetAllUsers()
        {
            return await _context.Users
                .Where(u => u.Role == "User")
                .Select(u => (object)new
                {
                    u.UserId,
                    u.Name,
                    u.Email,
                    u.CreatedAt
                })
                .ToListAsync();
        }
    }
}