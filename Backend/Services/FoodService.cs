using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using DnsClient.Protocol;

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

  public async Task<bool> DeleteProductByIdAsync(string id)
  {
    var result = await _products.DeleteOneAsync(product => product.Id_prod == Int32.Parse(id));
    
    return result.DeletedCount > 0;
  }

  public async Task CreateProductAsync(FoodModel product)
  {
    await _products.InsertOneAsync(product);
  }

  public async Task UpdateProductByIdAsync(string id, FoodModel updatedProduct)
  {
    var filter = Builders<FoodModel>.Filter.Eq(product => product.Id_prod, Int32.Parse(id));
  }
}