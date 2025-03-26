using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Any;
using MongoDB.Driver;

public class MealsService
{

  private readonly IMongoCollection<MealModel> _mealModel;
  private readonly ILogger<MealsService> _logger;

  public MealsService(MongoDBContext context, ILogger<MealsService> logger)
  {
    _mealModel = context.GetCollection<MealModel>("MealsData");
    _logger = logger;
  }

  public async Task SaveData(MealModel meals)
  {
    try
    {
      var user = await _mealModel.Find(user => user.Email == meals.Email).FirstOrDefaultAsync();

      if (user != null)
      {
        var filter = Builders<MealModel>.Filter.Eq(m => m.Email, meals.Email);
        var update = Builders<MealModel>.Update.Push(m => m.Details, meals.Details.FirstOrDefault());
        await _mealModel.UpdateOneAsync(filter, update);
      }
      else
      {
        await _mealModel.InsertOneAsync(meals);
        _logger.LogInformation("Meal data saved");
      }

    }
    catch (Exception error)
    {
      _logger.LogError("Error while saving meal data");
      throw new Exception("Błąd przy zapisywaniu danych o posiłku" + " " + error);
    }
  }
}