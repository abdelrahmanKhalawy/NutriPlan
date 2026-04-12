namespace MealPlanPlatform.API.Models
{
    public class Coach
    {
        public int CoachId { get; set; }
        public string ExperienceLevel { get; set; } = string.Empty;
        public string? Bio { get; set; }

        // Navigation Properties
        public ICollection<UserCoach> UserCoaches { get; set; } = new List<UserCoach>();
    }
}