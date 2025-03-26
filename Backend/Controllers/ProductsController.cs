using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v01/products")]

public class ProductsController : ControllerBase
{
  private readonly ProductsService _productsService;

  public ProductsController(ProductsService productsService)
  {
    _productsService = productsService;
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


}