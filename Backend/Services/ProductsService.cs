using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

public class ProductsService 
{
  private readonly IMongoCollection<ProductModel> _products;
  public ProductsService(MongoDBContext context)
  {
    _products = context.GetCollection<ProductModel>("ProductData");
  }

  public async Task CreateProductAsync(ProductModel product)
  {
    await _products.InsertOneAsync(product);
  }
  public async Task<List<ProductModel>> GetAllProductsAsync()
  {
    return await _products.Find(product => true).ToListAsync();  
  }

  public async Task<ProductModel?> GetProductByIdAsync(string id)
  { 
    return await _products.Find(product => product.Id_prod == Int32.Parse(id)).FirstOrDefaultAsync();
  }

  public async Task UpdateProductAsync(string id, ProductModel updatedProductValues)
  {
    var filter = Builders<ProductModel>.Filter.Eq(product => product.Id_prod, Int32.Parse(id));
    var update = Builders<ProductModel>.Update;
    var updates = new List<UpdateDefinition<ProductModel>>();

     if(!string.IsNullOrEmpty(updatedProductValues.Name))
    {
      updates.Add(update.Set(product => product.Name, updatedProductValues.Name));
    }

    if(updatedProductValues.ProductDetails != null)
    {
      if(updatedProductValues.ProductDetails.Kcal != 0 )
      {
        updates.Add(update.Set(product => product.ProductDetails.Kcal, updatedProductValues.ProductDetails.Kcal));
      }
      if(updatedProductValues.ProductDetails.Proteins != 0 )
      {
        updates.Add(update.Set(product => product.ProductDetails.Proteins, updatedProductValues.ProductDetails.Proteins));
      }
      if(updatedProductValues.ProductDetails.Fats != 0 )
      {
        updates.Add(update.Set(product => product.ProductDetails.Fats, updatedProductValues.ProductDetails.Fats));
      }
      if(updatedProductValues.ProductDetails.Carbohydrates != 0 )
      {
        updates.Add(update.Set(product => product.ProductDetails.Carbohydrates, updatedProductValues.ProductDetails.Carbohydrates));
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
  public async Task<bool> DeleteProductByIdAsync(string id)
  {
    var result = await _products.DeleteOneAsync(product => product.Id_prod == Int32.Parse(id));
    
    return result.DeletedCount > 0;
  }
}