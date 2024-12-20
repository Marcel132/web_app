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

  [HttpPost]
  public async Task<IActionResult> CreateProduct([FromBody] FoodModel newProduct)
  {
    if( newProduct == null)
    {
      return BadRequest("Invalid Data: data is null");
    }

    await _foodService.CreateProductAsync(newProduct);
    return CreatedAtAction(nameof(GetAllProducts), null, newProduct);
  }

  [HttpPut("{id}")]
  public async Task<IActionResult> UpdateProductById(string id, [FromBody] FoodModel updatedValue)
  {
    if (updatedValue == null)
    {
      return BadRequest("Invalid data: data is null");
    }

    try 
    {
        await _foodService.UpdateProductByIdAsync(id, updatedValue);
        return NoContent();
    }
    catch (Exception ex) 
    {
      return StatusCode(500, $"Internal server error: {ex.Message}");
    }
  }
}


