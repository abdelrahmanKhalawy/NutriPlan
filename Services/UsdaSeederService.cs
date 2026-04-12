using System.Text.Json;
using MealPlanPlatform.API.Data;
using MealPlanPlatform.API.Models;

namespace MealPlanPlatform.API.Services
{
    public class UsdaSeederService
    {
        private readonly AppDbContext _context;
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public UsdaSeederService(AppDbContext context,
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration)
        {
            _context = context;
            _httpClient = httpClientFactory.CreateClient();
            _apiKey = configuration["Usda:ApiKey"]!;
        }

        public async Task SeedFoods()
        {
            // If foods already seeded, skip
            if (_context.Foods.Any()) return;

            // Foods we want to search for with their categories and tags
            var foodsToSearch = new List<(string query, string category, string tags)>
            {
                // Breakfast
                ("scrambled eggs",           "Breakfast", ""),
                ("oatmeal",                  "Breakfast", ""),
                ("greek yogurt",             "Breakfast", "dairy"),
                ("whole wheat toast",        "Breakfast", "gluten"),
                ("banana",                   "Breakfast", ""),
                ("boiled eggs",              "Breakfast", ""),
                ("milk",                     "Breakfast", "dairy"),
                ("orange juice",             "Breakfast", ""),

                // Lunch
                ("grilled chicken breast",   "Lunch", ""),
                ("grilled salmon",           "Lunch", "fish"),
                ("lentil soup",              "Lunch", ""),
                ("tuna salad",               "Lunch", "fish"),
                ("brown rice",               "Lunch", ""),
                ("vegetable soup",           "Lunch", ""),
                ("chickpeas",                "Lunch", ""),
                ("grilled turkey breast",    "Lunch", ""),

                // Dinner
                ("baked chicken",            "Dinner", ""),
                ("steamed broccoli",         "Dinner", ""),
                ("grilled fish",             "Dinner", "fish"),
                ("quinoa",                   "Dinner", ""),
                ("sweet potato",             "Dinner", ""),
                ("beef steak lean",          "Dinner", ""),
                ("Caesar salad",             "Dinner", "dairy"),
                ("mixed vegetables",         "Dinner", ""),

                // Snack
                ("almonds",                  "Snack", "nuts"),
                ("apple",                    "Snack", ""),
                ("protein bar",              "Snack", ""),
                ("cottage cheese",           "Snack", "dairy"),
                ("peanut butter",            "Snack", "nuts"),
                ("dates",                    "Snack", ""),
                ("mixed nuts",              "Snack", "nuts"),
                ("carrot sticks",            "Snack", ""),
            };

            var foodsToAdd = new List<Food>();

            foreach (var (query, category, tags) in foodsToSearch)
            {
                try
                {
                    var url = $"https://api.nal.usda.gov/fdc/v1/foods/search" +
                                $"?query={Uri.EscapeDataString(query)}" +
                                $"&pageSize=1" +
                                $"&dataType=SR%20Legacy,Foundation" +
                                $"&api_key={_apiKey}";

                    var response = await _httpClient.GetStringAsync(url);
                    var json = JsonDocument.Parse(response);
                    var foods = json.RootElement.GetProperty("foods");

                    if (foods.GetArrayLength() == 0) continue;

                    var food = foods[0];
                    var nutrients = food.GetProperty("foodNutrients");

                    // Extract nutrients
                    double calories = GetNutrient(nutrients, "Energy");
                    double protein = GetNutrient(nutrients, "Protein");
                    double carbs = GetNutrient(nutrients, "Carbohydrate");
                    double fat = GetNutrient(nutrients, "Total lipid");

                    // Per 100g - we'll use standard serving size (150g)
                    double servingMultiplier = 1.5;

                    foodsToAdd.Add(new Food
                    {
                        Name = food.GetProperty("description").GetString()!,
                        Calories = (int)(calories * servingMultiplier),
                        Protein = Math.Round(protein * servingMultiplier, 1),
                        Carbs = Math.Round(carbs * servingMultiplier, 1),
                        Fat = Math.Round(fat * servingMultiplier, 1),
                        Category = category,
                        Tags = tags
                    });

                    // Small delay to avoid rate limiting
                    await Task.Delay(200);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to fetch {query}: {ex.Message}");
                }
            }

            _context.Foods.AddRange(foodsToAdd);
            await _context.SaveChangesAsync();

            Console.WriteLine($"Seeded {foodsToAdd.Count} foods successfully!");
        }

        private double GetNutrient(JsonElement nutrients, string name)
        {
            foreach (var nutrient in nutrients.EnumerateArray())
            {
                var nutrientName = nutrient.GetProperty("nutrientName").GetString() ?? "";
                if (nutrientName.Contains(name, StringComparison.OrdinalIgnoreCase))
                {
                    if (nutrient.TryGetProperty("value", out var val))
                        return val.GetDouble();
                }
            }
            return 0;
        }
    }
}