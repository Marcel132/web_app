using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Any;

public class MealsService 
{

  public MealsService(MongoDBContext context)
  {
  }

  public async Task SaveData(MealsModel meals)
  {
    return;
  }
}