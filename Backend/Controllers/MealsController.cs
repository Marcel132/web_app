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

  [HttpPost]
  public async Task<IActionResult> GetMealsData([FromBody] GetMealsRequest request)
  {
    if(string.IsNullOrEmpty(request.Email))
    {
      _logger.LogError("Error: Email is null or empty");
      return BadRequest(new {state = false, message = "Brak emaila"});
    }
    if(string.IsNullOrEmpty(request.Role))
    {
      _logger.LogError("Error: Role is null or empty");
      return BadRequest(new {state = false, message = "Zaloguj się ponownie"});
    }

    try {
      var data = await _mealsService.GetUserMeal(request.Email);
      return Ok( new {state = true, response = data});
    }
    catch(ArgumentException error)
    {
      _logger.LogError("Error: " + error.Message);
      return BadRequest(new {state = false, message = error.Message});
    }
    catch(Exception error)
    {
      _logger.LogError("Error: " + error.Message);
      return BadRequest(new {state = false, message = error.Message});
    }
  }
}
public class GetMealsRequest {
  public string? Email { get; set;}
  public string? Role { get; set;}
}