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
        var authToken = _tokenService.GenerateAccessToken(newUser.Id, newUser.role, newUser.login);
        var refreshToken = _tokenService.GenerateRefreshToken();
        
        Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.Now.AddDays(7)
        });

        return Ok(new { authToken });
    }
    catch (UserAlreadyExistsException ex)
    {
        // Error: User is exists in db
        _logger.LogInformation("Return 409 Status");
        return Conflict(new { message = ex.Message });
    }
    catch (Exception ex)
    {
        // Error: Other 
        _logger.LogError("Unexpected error: {Error}", ex.Message);
        return StatusCode(500, new { message = "An unexpected error occurred" });
    }
  }

  [HttpPost("login")]
  public async Task<IActionResult> LoginUser([FromBody] UsersModel existingUser)
  {
    if(existingUser == null){
      return BadRequest(new { message = "User data is missing"});
    }

    try
    {
        await _usersService.LoginUserAsync(existingUser);
        var authToken = _tokenService.GenerateAccessToken(existingUser.Id, existingUser.role, existingUser.login);
        var refreshToken = _tokenService.GenerateRefreshToken();
        
        Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.Now.AddDays(7)
        });

        return Ok(new { authToken });
    }
    catch (UserAlreadyExistsException ex)
    {
        // Error: User is exists in db
        _logger.LogInformation("Return 409 Status");
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