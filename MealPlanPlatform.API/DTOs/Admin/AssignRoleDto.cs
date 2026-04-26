namespace MealPlanPlatform.API.DTOs.Admin
{
    public class AssignRoleDto
    {
        public int UserId { get; set; }
        public string Role { get; set; } = string.Empty;
        // "User" or "Coach"
    }
}