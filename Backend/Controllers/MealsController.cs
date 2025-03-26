using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Any;

[ApiController]
[Route("api/v01/meals")]

public class MealsController : ControllerBase
{
  private readonly MealsService _mealsService;
  private readonly ILogger<MealsService> _logger;

  public MealsController(MealsService mealsService, ILogger<MealsService> logger)
  {
    _mealsService = mealsService;
    _logger = logger;
  }

  [HttpPost]
  public async Task<IActionResult> SaveData([FromBody] MealModel meals)
  {
    try
    {
      await _mealsService.SaveData(meals);
      return Ok("Data saved");
    }
    catch (Exception ex)
    {
      _logger.LogError("Unexpected error: {Error}", ex.Message);
      return StatusCode(500, new { message = "An unexpected error occurred" });
    }
  }

}