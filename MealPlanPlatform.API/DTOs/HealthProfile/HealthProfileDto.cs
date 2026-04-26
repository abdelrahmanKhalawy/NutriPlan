namespace MealPlanPlatform.API.DTOs.HealthProfile
{
    public class HealthProfileDto
    {
        public double Height { get; set; }
        public double Weight { get; set; }
        public int Age { get; set; }
        public string BloodType { get; set; } = string.Empty;
        public string? Diseases { get; set; }
        public string? Allergies { get; set; }
        public string? FavoriteFoods { get; set; }
        public int MealsPerDay { get; set; }
        public string Goal { get; set; } = string.Empty;
        // "WeightLoss" / "WeightGain" / "MuscleBuilding"
    }
}