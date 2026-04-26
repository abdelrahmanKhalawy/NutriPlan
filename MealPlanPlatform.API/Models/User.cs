namespace MealPlanPlatform.API.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "User"; // "User" or "Coach"
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public UserHealthProfile? HealthProfile { get; set; }
        public ICollection<MealPlan> MealPlans { get; set; } = new List<MealPlan>();
        public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
        public ICollection<Progress> ProgressRecords { get; set; } = new List<Progress>();
        public ICollection<UserCoach> UserCoaches { get; set; } = new List<UserCoach>();
        public ICollection<UserCoach> CoachAssignments { get; set; } = new List<UserCoach>();
    }
}