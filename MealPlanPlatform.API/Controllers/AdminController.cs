using MealPlanPlatform.API.DTOs.Admin;
using MealPlanPlatform.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MealPlanPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AdminService _adminService;

        public AdminController(AdminService adminService)
        {
            _adminService = adminService;
        }

        // GET: api/admin/users
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _adminService.GetAllUsers();
            return Ok(users);
        }

        // POST: api/admin/assign-role
        [HttpPost("assign-role")]
        public async Task<IActionResult> AssignRole(AssignRoleDto dto)
        {
            var result = await _adminService.AssignRole(dto);
            if (!result)
                return NotFound(new { message = "User not found" });

            return Ok(new { message = $"Role updated to {dto.Role} successfully" });
        }

        // POST: api/admin/assign-coach
        [HttpPost("assign-coach")]
        public async Task<IActionResult> AssignCoach(AssignCoachDto dto)
        {
            var result = await _adminService.AssignCoach(dto);
            if (!result)
                return BadRequest(new { message = "Assignment failed. Check IDs and roles." });

            return Ok(new { message = "Coach assigned to user successfully" });
        }
    }
}