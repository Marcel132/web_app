using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("api/v01/users")]

public class UsersController : ControllerBase 
{
  private readonly UsersService _usersService;
  private readonly TokenService _tokenService;

  public UsersController(UsersService usersService, TokenService tokenService)
  {
    _tokenService = tokenService;
    _usersService = usersService;
  }

  [HttpPost("register")]
  public async Task<IActionResult> RegisterUser([FromBody] UsersModel newUser)
  {
    if(newUser == null){
      return BadRequest("User data is missing");
    }

    await _usersService.RegisterUserAsync(newUser);

    var token = _tokenService.GenerateAccessToken(newUser.uid);
    return Ok( new { token });
  }
}