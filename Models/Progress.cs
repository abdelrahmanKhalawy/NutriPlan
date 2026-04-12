namespace MealPlanPlatform.API.Models
{
    public class Progress
    {
        public int ProgressId { get; set; }
        public double Weight { get; set; }
        public int Week { get; set; }
        public string? PhotoUrl { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign Key
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}