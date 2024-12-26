using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("api/v01/users")]

public class UsersController : ControllerBase 
{
  private readonly UsersService _usersService;

  public UsersController(UsersService usersService)
  {
    _usersService = usersService;
  }

  [HttpPost("register")]
  public async Task<IActionResult> RegisterUser([FromBody] UsersModel newUser)
  {
    if(newUser == null){
      return BadRequest("User data is missing");
    }

    await _usersService.RegisterUserAsync(newUser);

    return Ok();
  }
}