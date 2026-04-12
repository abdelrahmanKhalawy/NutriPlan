namespace MealPlanPlatform.API.Models
{
    public class Food
    {
        public int FoodId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Calories { get; set; }
        public double Protein { get; set; }
        public double Carbs { get; set; }
        public double Fat { get; set; }
        public string Category { get; set; } = string.Empty;
        // "Breakfast" / "Lunch" / "Dinner" / "Snack"
        public string Tags { get; set; } = string.Empty;
        // "dairy" / "nuts" / "fish" / "gluten"
    }
}