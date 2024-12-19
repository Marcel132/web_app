using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;

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

  public async Task<FoodModel?> GetProductByIdAsync(string id)
  { 
    return await _products.Find(product => product.Id_prod == Int32.Parse(id)).FirstOrDefaultAsync();
  }
}