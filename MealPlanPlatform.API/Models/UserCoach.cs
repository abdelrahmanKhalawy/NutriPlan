namespace MealPlanPlatform.API.Models
{
    public class UserCoach
    {
        public int UserCoachId { get; set; }

        // Foreign Keys
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int CoachId { get; set; }
        public User Coach { get; set; } = null!; // Coach is a User with Role = "Coach"
    }
}