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
    _usersService = usersService;
    _tokenService = tokenService;
    _logger = logger;
  }

  [HttpPost("register")]
  public async Task<IActionResult> RegisterUser([FromBody] UsersModel request)
  {
    if(request == null)
    {
      _logger.LogError("BadRequest: newUser is missing");
      return BadRequest(new {state = false, message = "Błędne dane!"});
    }

    if(string.IsNullOrEmpty(request.Email))
    {
      _logger.LogError("BadRequest: Email is missing");
      return BadRequest(new {state = false, message = "Błąd! Email jest niepoprawny"});
    }

    if(string.IsNullOrEmpty(request.Password))
    {
      _logger.LogError("BadRequest: Password is missing");
      return BadRequest(new {state = false, message = "Błąd! Hasło jest niepoprawny"});
    } 

    if(string.IsNullOrEmpty(request.Role))
    {
      _logger.LogError("BadRequest: Role is missing");
      return BadRequest(new {state = false, message = "Błąd! Brak roli"});
    }

    try {
      await _usersService.RegisterUserAsync(request);
      var authToken = _tokenService.GenerateAccessToken(request.Id, request.Role, request.Email);
      var refreshToken = _tokenService.GenerateRefreshToken();

      await _usersService.CreatedUserDataOfMealsAsync(request.Email);
      Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.Now.AddDays(7)
        });

        return Ok(new { authToken });

    }
    catch(UserAlreadyExistsException ex){
      _logger.LogError("Conflict: User already exists");
      return Conflict(new {state = false, message = ex.Message });
    }
    catch(ArgumentException ex){
      _logger.LogError("BadRequest: Argument is missing");
      return BadRequest(new {state = false, message = ex.Message});
    }
    catch(Exception ex)
    {
      _logger.LogError("Unexpected error: {Error}", ex.Message);
      return StatusCode(500, new { message = ex.Message });
    }
  }

  [HttpPost("login")]
  public async Task<IActionResult> LoginUser([FromBody] UsersModel request)
  {
    if(request == null)
    {
      _logger.LogError("BadRequest: newUser is missing");
      return BadRequest(new {state = false, message = "Błąd! "});
    }

    if(string.IsNullOrEmpty(request.Email))
    {
      _logger.LogError("BadRequest: Email is missing");
      return BadRequest(new {state = false, message = "Email jest niepoprawny"});
    }

    if(string.IsNullOrEmpty(request.Password))
    {
      _logger.LogError("BadRequest: Password is missing");
      return BadRequest(new {state = false, message = "Hasło jest niepoprawny"});
    } 

    if(string.IsNullOrEmpty(request.Role))
    {
      _logger.LogError("BadRequest: Role is missing");
      return BadRequest(new {state = false, message = "Brak roli"});
    }

    try
    {
      await _usersService.LoginUserAsync(request);
      var authToken = _tokenService.GenerateAccessToken(request.Id, request.Role, request.Email);
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
    catch(ArgumentException ex)
    {
      _logger.LogError("BadRequest: Argument is missing", ex.Message );
      return BadRequest(new {state = false, message = "Błąd argumentu"});
    }
    catch(UserNotFoundException ex)
    {
     _logger.LogError("BadRequest: User not found", ex.Message );
      return BadRequest(new {state = false, message = "Nie znaleziono użytkownika o takim emailu"});
    }
    catch(Exception ex)
    {
      _logger.LogError("Unexpected error: {Error}", ex.Message);
      return StatusCode(500, new { message = ex.Message });
    }
  }

  [HttpPost("subscription")]
  public async Task<IActionResult> GetSubscriptionInfo([FromBody] SubscriptionRequest request)
  {
    if(request == null) 
    {
      _logger.LogError("BadRequest. Request is null ");
      return BadRequest(new {state = false, message = "Błędne zapytanie"});
    }
    if(string.IsNullOrEmpty(request.Email))
    {
      _logger.LogError("BadRequest. is null ");
      return BadRequest(new {state = false, message = ""});
    }
    if(string.IsNullOrEmpty(request.Role))
    {
      _logger.LogError("BadRequest. is null ");
      return BadRequest(new {state = false, message = ""});
    }

    try
    {
      var subscriptionDetails = await _usersService.GetSubscriptionDetails(request.Email);
      var token = _tokenService.GenerateSubscriptionToken(subscriptionDetails);
      return Ok(new {token});
    }
    catch (System.Exception)
    {
      
      throw;
    }
  }

}
//   [HttpGet("package/{email}")]
//   public async Task<IActionResult> GetPackage([FromRoute] string email)
//   {
//     _logger.LogCritical("{Email}", email );
//     try
//     {
//       var package = await _usersService.GetSubscriptionDetails(email);

//       if(package == null)
//       {
//           return NotFound(new { message = "Package not found" });
//       } 

//       _logger.LogInformation(package.Email);

//       var token = _tokenService.GeneratePacksPackageToken(package);
//       return Ok(new { token });

//     }
//     catch (Exception ex)
//     {
//         _logger.LogError("Unexpected error: {Error}", ex.Message);
//         return StatusCode(500, new { message = "An unexpected error occurred" });
//     }
//   }
// }

public class SubscriptionRequest {
  public string? Email { get; set;}
  public string? Role { get; set;}
}