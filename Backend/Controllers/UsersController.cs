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
  public async Task<IActionResult> RegisterUser([FromBody] UsersModel data)
  {
    if(data == null)
    {
      _logger.LogError("BadRequest: newUser is missing");
      return BadRequest(new {state = false, message = "Błędne dane!"});
    }

    if(string.IsNullOrEmpty(data.Email))
    {
      _logger.LogError("BadRequest: Email is missing");
      return BadRequest(new {state = false, message = "Błąd! Email jest niepoprawny"});
    }

    if(string.IsNullOrEmpty(data.Password))
    {
      _logger.LogError("BadRequest: Password is missing");
      return BadRequest(new {state = false, message = "Błąd! Hasło jest niepoprawny"});
    } 

    if(string.IsNullOrEmpty(data.Role))
    {
      _logger.LogError("BadRequest: Role is missing");
      return BadRequest(new {state = false, message = "Błąd! Brak roli"});
    }

    try {
      await _usersService.RegisterUserAsync(data);
      var authToken = _tokenService.GenerateAccessToken(data.Id, data.Role, data.Email);
      var refreshToken = _tokenService.GenerateRefreshToken();

      await _usersService.CreatedUserDataOfMealsAsync(data.Email);
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
  public async Task<IActionResult> LoginUser([FromBody] UsersModel data)
  {
    if(data == null)
    {
      _logger.LogError("BadRequest: newUser is missing");
      return BadRequest(new {state = false, message = "Błąd! "});
    }

    if(string.IsNullOrEmpty(data.Email))
    {
      _logger.LogError("BadRequest: Email is missing");
      return BadRequest(new {state = false, message = "Email jest niepoprawny"});
    }

    if(string.IsNullOrEmpty(data.Password))
    {
      _logger.LogError("BadRequest: Password is missing");
      return BadRequest(new {state = false, message = "Hasło jest niepoprawny"});
    } 

    if(string.IsNullOrEmpty(data.Role))
    {
      _logger.LogError("BadRequest: Role is missing");
      return BadRequest(new {state = false, message = "Brak roli"});
    }

    try
    {
      await _usersService.LoginUserAsync(data);
      var authToken = _tokenService.GenerateAccessToken(data.Id, data.Role, data.Email);
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

}

//   [HttpPost("login")]
//   public async Task<IActionResult> LoginUser([FromBody] UsersModel existingUser)
//   {
//     if(existingUser == null){
//       return BadRequest(new { message = "User data is missing"});
//     }

//     try
//     {
//         await _usersService.LoginUserAsync(existingUser);
//         _logger.LogInformation("Dane: {Data}", existingUser);
//         _logger.LogInformation("Login użytkownika: {Login}", existingUser.Login);
//         _logger.LogInformation("Rola użytkownika {Role}", existingUser.Role);

//         var authToken = _tokenService.GenerateAccessToken(existingUser.Id, existingUser.Role, existingUser.Login);
//         var refreshToken = _tokenService.GenerateRefreshToken();
        
//         Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
//         {
//             HttpOnly = true,
//             Secure = true,
//             SameSite = SameSiteMode.None,
//             Expires = DateTime.Now.AddDays(7)
//         });

//         return Ok(new { authToken });
//     }
//     // catch (UserAlreadyExistsException ex)
//     // {
//     //     // Error: User is exists in db
//     //     _logger.LogInformation("Return 409 Status");
//     //     return Conflict(new { message = ex.Message });
//     // }
//     catch (UserArentExistisException ex) 
//     {
//       _logger.LogError("404 Not Found", ex);
//       return NotFound( new {message = ex.Message});
//     }
//     catch (Exception ex)
//     {
//         // Error: Other 
//         _logger.LogError("Unexpected error: {Error}", ex.Message);
//         return StatusCode(500, new { message = "An unexpected error occurred" });
//     }
//   }

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