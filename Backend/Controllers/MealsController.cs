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

  [HttpPost("add-data")]
  public async Task<IActionResult> SaveData([FromBody] MealModel meals)
  {
    if(meals == null){
      _logger.LogError("Error with meals data");
      return BadRequest(new {state = false, message = "Błąd z danymi"});
    }
    try
    {
      await _mealsService.SaveData(meals);
      return Ok(new {state = true, message = "Zapisano dane"});
    }
    catch(ArgumentException ex)
    { 
      _logger.LogError("Error with data" + ex);
      return BadRequest(new {state = false, message = "Błąd z danymi"});;
    }
    catch (Exception ex)
    {
      _logger.LogError("Unexpected error: {Error}", ex.Message);
      return StatusCode(500, new { message = "An unexpected error occurred" });
    }
  }

}