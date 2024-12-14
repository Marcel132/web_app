using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

public class FoodService 
{
  private readonly IMongoCollection<FoodModel> _products;

  public FoodService(MongoDBContext context)
  {
    _products = context.GetCollection<FoodModel>("FoodCalories");
  }

  public async Task<List<FoodModel>> GetAllProductsAsync()
  {
    return await _products.Find(product => true).ToListAsync();  
  }
}