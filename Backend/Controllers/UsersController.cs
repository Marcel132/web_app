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
      throw new ArgumentException("Błąd: Email jest pusty");
    }

    try {
      await _usersService.RegisterUserAsync(request);

      var accessToken = _tokenService.GenerateAccessToken(request.Id, request.Role, request.Email);
      var refreshToken = _tokenService.GenerateRefreshToken();

      Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
      {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.None,
        Expires = DateTime.Now.AddDays(7)
      });

      return Ok(new {state = true, message = "Użytkownik został zarejestrowany", accessToken});
    }
    catch(UserAlreadyExistsException error)
    {
      _logger.LogError("User with login {Login} already exists", request.Email + " " + error);
      return Conflict(new {state = false, message = error.Message});
    }
    catch(ArgumentException error)
    {
      _logger.LogError("Error while creating a user");
      return BadRequest(new {state = false, message = error.Message});
    }
    catch(UserNotFoundException error)
    {
      _logger.LogError("User with login {Login} not found", request.Email);
      return NotFound(new {state = false, message = error.Message});
    }
    catch(Exception error)
    {
      _logger.LogError("Error with data" + error);
      return BadRequest(new {state = false, message = error.Message});
    }
  }

  [HttpPost("login")]
  public async Task<IActionResult> LoginUser([FromBody] UsersModel request)
  {
    if(request == null)
    {
      _logger.LogError("BadRequest: newUser is missing");
      return BadRequest(new {state = false, message = "Brak danych!"});
    }

    if(string.IsNullOrEmpty(request.Email))
    {
      throw new ArgumentException("Błąd: Email jest pusty");
    }
    if(string.IsNullOrEmpty(request.Password))
    {
      throw new ArgumentException("Błąd: Hasło jest puste");
    }

    try 
    {
      await _usersService.LoginUserAsync(request);

      var accessToken = _tokenService.GenerateAccessToken(request.Id, request.Role, request.Email);
      var refreshToken = _tokenService.GenerateRefreshToken();

      Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
      {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.None,
        Expires = DateTime.Now.AddDays(7)
      });

      return Ok(new {state = true, message = "Użytkownik został zalogowany", accessToken});
    }
        catch(ArgumentException error)
    {
      _logger.LogError("Error while creating a user");
      return BadRequest(new {state = false, message = error.Message});
    }
    catch(UserNotFoundException error)
    {
      _logger.LogError("User with login {Login} not found", request.Email);
      return NotFound(new {state = false, message = error.Message});
    }
    catch(Exception error)
    {
      _logger.LogError("Error while creating a user");
      return BadRequest(new {state = false, message = "Błąd przy tworzeniu użytkownika" + " " + error});
    }
  }

  [HttpPost("subscription")]
  public async Task<IActionResult> GetSubscriptionDetails([FromBody] SubscriptionRequest request)
  {
    if(request == null)
    {
      _logger.LogError("BadRequest: Request is missing");
      return BadRequest(new {state = false, message = "Brak danych!"});
    }
    if(string.IsNullOrEmpty(request.Email))
    {
      _logger.LogError("BadRequest: Email is missing");
      throw new ArgumentException("Błąd: Email jest pusty");
    }
    if(string.IsNullOrEmpty(request.Role))
    {
      _logger.LogError("BadRequest: Role is missing");
      throw new ArgumentException("Błąd: Rola jest pusta");
    }

    try
    {
      var subscriptionDetails = await _usersService.GetSubscriptionDetailsModelAsync(request.Email);

      var subscriptionToken = _tokenService.GenerateSubscriptionToken(subscriptionDetails);

      return Ok(new {state = true, message = "Dane subskrypcji", subscriptionToken});
    }
    catch(ArgumentException error)
    {
      _logger.LogError("Error while getting subscription details");
      return BadRequest(new {state = false, message = error.Message});
    }
    catch(Exception error)
    {
      _logger.LogError("Error while getting subscription details");
      return BadRequest(new {state = false, message = "Błąd przy pobieraniu danych subskrypcji" + " " + error});
    }
  }
}


public class SubscriptionRequest 
{
  public string? Email { get; set; }
  public string? Role { get; set; }
}