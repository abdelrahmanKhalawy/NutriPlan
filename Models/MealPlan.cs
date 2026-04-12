namespace MealPlanPlatform.API.Models
{
    public class MealPlan
    {
        public int MealPlanId { get; set; }
        public int Day { get; set; }         // 1 to 30
        public string MealType { get; set; } = string.Empty;
        // "Breakfast" / "Lunch" / "Dinner" / "Snack"
        public string FoodName { get; set; } = string.Empty;
        public int Calories { get; set; }
        public double Protein { get; set; }
        public double Carbs { get; set; }
        public double Fat { get; set; }

        // Foreign Key
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}