using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v01/products")]

public class ProductsController : ControllerBase
{
  private readonly ProductsService _productsService;
  private readonly ILogger<ProductsService> _logger;

  public ProductsController(ProductsService productsService, ILogger<ProductsService> logger)
  {
    _productsService = productsService;
    _logger = logger;
  }

  [HttpGet]
  public async Task<IActionResult> GetAllProducts()
  {
    var products = await _productsService.GetAllProductsAsync();

    if(products == null || products.Count == 0)
    {
      return NotFound("No products found.");
    }
    return Ok(products);
  }

  [Authorize(Roles = "Admin")]
  [HttpPost]
  public async Task<IActionResult> PostProduct([FromBody] ProductModel request)
  {
    if(request == null)
    {
      return BadRequest(new {status = true, message = "Request is null"});
    }
    try
    {
      await _productsService.CreateProductAsync(request);
      _logger.LogInformation("Zapisano dane");
      return Ok(new { status = true, message = "Zapisano produkt"}); 
    }
    catch(ArgumentException ex)
    {
      return BadRequest( new {status = false, message = ex.Message});
    }
    catch (Exception ex)
    {
      return StatusCode(500,  new {status = false, message = ex.Message}); 
    }
  }

}