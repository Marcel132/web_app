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
        _logger.LogInformation("User {Role} created", newUser.Role);
        var authToken = _tokenService.GenerateAccessToken(newUser.Id, newUser.Role, newUser.Login);
        var refreshToken = _tokenService.GenerateRefreshToken();
        await _usersService.CreateUserWithDataOfMeals(newUser.Login);

        
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
        _logger.LogInformation("Dane: {Data}", existingUser);
        _logger.LogInformation("Login użytkownika: {Login}", existingUser.Login);
        _logger.LogInformation("Rola użytkownika {Role}", existingUser.Role);

        var authToken = _tokenService.GenerateAccessToken(existingUser.Id, existingUser.Role, existingUser.Login);
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
    // catch (UserAlreadyExistsException ex)
    // {
    //     // Error: User is exists in db
    //     _logger.LogInformation("Return 409 Status");
    //     return Conflict(new { message = ex.Message });
    // }
    catch (UserArentExistisException ex) 
    {
      _logger.LogError("404 Not Found", ex);
      return NotFound( new {message = ex.Message});
    }
    catch (Exception ex)
    {
        // Error: Other 
        _logger.LogError("Unexpected error: {Error}", ex.Message);
        return StatusCode(500, new { message = "An unexpected error occurred" });
    }
  }
}