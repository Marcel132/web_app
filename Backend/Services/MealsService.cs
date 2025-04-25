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
    if(string.IsNullOrEmpty(meals.Email))
    {
      throw new ArgumentException("Email jest pusty");
    }
    if(meals.Details == null)
    {
      throw new ArgumentException("Szczegóły posiłku są puste");
    }
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

  public async Task DeleteMeal(string email, string mealId){

    if(string.IsNullOrEmpty(email) || string.IsNullOrEmpty(mealId))
    {
      throw new ArgumentException("Email lub ID posiłku są puste");
    }
    try
    {
      var filter = Builders<MealModel>.Filter.Eq(m => m.Email, email) & Builders<MealModel>.Filter.ElemMatch(m => m.Details, d => d.Id == mealId);
      var update = Builders<MealModel>.Update.PullFilter(m => m.Details, d => d.Id == mealId);
      await _mealModel.UpdateOneAsync(filter, update);
    }
    catch (Exception error)
    {
      _logger.LogError("Error while deleting meal data" + error.Message);
      throw new Exception("Błąd przy usuwaniu danych o posiłku" + " " + error.Message);
    }

  }
  public async Task<MealModel> GetUserMeal(string email)
  {
    try
    {
      var user = await _mealModel.Find(user => user.Email == email ).FirstOrDefaultAsync();
      if(user != null)
      {
        return user;
      }
      else {
        throw new Exception("Nie znaleziono użytkownika");
      }
    }
    catch (Exception error)
    {
      _logger.LogError(error.Message);
      throw new Exception(error.Message);
    }
  }
}
