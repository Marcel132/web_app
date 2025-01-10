using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("api/v01/users")]

public class UsersController : ControllerBase 
{
  private readonly UsersService _usersService;
  private readonly TokenService _tokenService;
  private readonly ILogger<UsersService> _logger;

  public UsersController(UsersService usersService, TokenService tokenService, ILogger<UsersService> logger)
  {
    _tokenService = tokenService;
    _usersService = usersService;
    _logger = logger;
  }

  [HttpPost("register")]
  public async Task<IActionResult> RegisterUser([FromBody] UsersModel newUser)
  {
    if(newUser == null){
      return BadRequest(new { message = "User data is missing"});
    }

    try
    {
        await _usersService.RegisterUserAsync(newUser);
        var token = _tokenService.GenerateAccessToken(newUser.uid);
        return Ok(new { token });
    }
    catch (UserAlreadyExistsException ex)
    {
        // Error: User is exists in db
        return Conflict(new { message = ex.Message });
    }
    catch (Exception ex)
    {
        // Error: Other 
        _logger.LogError("Unexpected error: {Error}", ex.Message);
        return StatusCode(500, new { message = "An unexpected error occurred" });
    }
  }
}