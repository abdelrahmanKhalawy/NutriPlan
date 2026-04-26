namespace MealPlanPlatform.API.DTOs.Progress
{
    public class ProgressDto
    {
        public double Weight { get; set; }
        public int Week { get; set; }
        public string? Notes { get; set; }
        public string? PhotoUrl { get; set; }
    }
}