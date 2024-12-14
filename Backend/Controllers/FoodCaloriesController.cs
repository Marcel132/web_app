using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/food")]


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
}