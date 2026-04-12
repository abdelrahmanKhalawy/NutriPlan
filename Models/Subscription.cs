namespace MealPlanPlatform.API.Models
{
    public class Subscription
    {
        public int SubscriptionId { get; set; }
        public string PlanType { get; set; } = string.Empty;
        // "MealPlanOnly" / "MealPlanWithTracking" / "MealPlanWithCoach"
        public decimal Price { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = "Active"; // "Active" / "Expired"

        // Foreign Key
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}