using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v01/food")]


public class FoodCaloriesController : ControllerBase 
{
  private readonly FoodService _foodService;

  public FoodCaloriesController(FoodService foodService)
  {
    _foodService = foodService;
  }

  [HttpGet]
  public async Task<IActionResult> GetAllProducts()
  {
    var products = await _foodService.GetAllProductsAsync();

    if( products == null || products.Count == 0)
    {
      return NotFound("No products found.");
    }
    return Ok(products);
  }

  [HttpGet("{id}")]
  public async Task<IActionResult> GetProductById( string id )
  {
    var product = await _foodService.GetProductByIdAsync(id);

    if( product == null )
    {
      return NotFound("No products found");
    }

      return Ok(product);
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> DeleteProductById( string id )
  {
    var result = await _foodService.DeleteProductByIdAsync(id);

    if( result )
    {
      return NoContent();
    }
    else
    {
        return NotFound("Product not found"); 
    }
  }
}
