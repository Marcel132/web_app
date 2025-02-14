using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v01/user-data")]

public class UserDataController : ControllerBase
{
  private readonly UsersService _usersService;
  private readonly ILogger<UsersService> _logger;

  public UserDataController(UsersService usersService, ILogger<UsersService> logger)
  {
    _usersService = usersService;
    _logger = logger;
  }

  [HttpPost("update-values")]
  public async Task<IActionResult> UpdateValues([FromBody] UserDataModel userData)
  {
    var newUserDataValues = new UserDataModel
    {
      Email = userData.Email,
      Weight = userData.Weight,
      Height = userData.Height,
      Age = userData.Age,
      Sex = userData.Sex,
    } ;

    try
    {
      await _usersService.UpdateUserData(userData.Email, newUserDataValues);

      return Ok();
    }
    catch (Exception ex)
    {
        _logger.LogError("Unexpected error: {Error}", ex.Message);
        return StatusCode(500, new { message = "An unexpected error occurred" });
    }
  }
}