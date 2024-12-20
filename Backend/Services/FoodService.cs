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

  public async Task UpdateProductByIdAsync(string id, FoodModel updatedValues)
  {
    var filter = Builders<FoodModel>.Filter.Eq(product => product.Id_prod, Int32.Parse(id));

    var update = Builders<FoodModel>.Update;

    var updates = new List<UpdateDefinition<FoodModel>>();

    if(!string.IsNullOrEmpty(updatedValues.Name))
    {
      updates.Add(update.Set(product => product.Name, updatedValues.Name));
    }

    if(updatedValues.Details != null)
    {
      if(updatedValues.Details.Kcal != 0 )
      {
        updates.Add(update.Set(product => product.Details.Kcal, updatedValues.Details.Kcal));
      }
      if(updatedValues.Details.Proteins != 0 )
      {
        updates.Add(update.Set(product => product.Details.Proteins, updatedValues.Details.Proteins));
      }
      if(updatedValues.Details.Fats != 0 )
      {
        updates.Add(update.Set(product => product.Details.Fats, updatedValues.Details.Fats));
      }
      if(updatedValues.Details.Carbohydrates != 0 )
      {
        updates.Add(update.Set(product => product.Details.Carbohydrates, updatedValues.Details.Carbohydrates));
      }
    }

    if(updates.Count > 0)
    {
      var combinedUpdate = update.Combine(updates);
      var result = await _products.UpdateOneAsync(filter, combinedUpdate);

      if(result.ModifiedCount == 0)
      {
        throw new Exception("No matching product found to update.");
      }
    }
    else {
      throw new Exception("No valid fields to updated");
    }
  }
}