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
  [Authorize(Roles = "Admin")]
  [HttpGet]
  public async Task<IActionResult> GetAllUsers()
  {
    var users = await _usersService.GetAllUsersAsync();

    if(users == null || users.Count == 0)
    {
      return NotFound("No users found.");
    }
    return Ok(users);
  }

  [HttpPost("register")]
  public async Task<IActionResult> RegisterUser([FromBody] UsersModel request)
  {
    if(request == null)
    {
      _logger.LogError("BadRequest: newUser is missing");
      return  StatusCode(400,new {state = false, message = "Błędne dane!"});
    }
    if(string.IsNullOrEmpty(request.Email))
    {
      return  StatusCode(400,new {state = false, message = "Błędne dane! Email jest pusty"});
    }
    if(string.IsNullOrEmpty(request.Role))
    {
      request.Role = "Free";
    }

    try {
      await _usersService.RegisterUserAsync(request);

      var accessToken = _tokenService.GenerateAccessToken(request.Id, request.Role, request.Email);
      var refreshToken = _tokenService.GenerateRefreshToken();

      Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
      {
        HttpOnly = true,
        Secure = false,
        SameSite = SameSiteMode.Strict,
        Expires = DateTime.Now.AddDays(7)
      });

      return Ok(new {state = true, message = "Użytkownik został zarejestrowany", accessToken});
    }
    catch(UserAlreadyExistsException error)
    {
      _logger.LogError("User with login {Login} already exists", request.Email + " " + error);
      return StatusCode(409, new {state = false, message = "Taki użytkownik już istnieje"});
    }
    catch(ArgumentException error)
    {
      _logger.LogError("Error while creating a user" + error.Message);
      return StatusCode(400, new {state = false, message = error.Message});
    }
    catch(UserNotFoundException error)
    {
      _logger.LogError("User with login {Login} not found", request.Email + error.Message);
      return StatusCode(404, new {state = false, message = "Nie znaleziono użytkownika"});
    }
    catch(Exception error)
    {
      _logger.LogError("Error with data" + error);
      return StatusCode(500, new {state = false, message = "Błąd, spróbuj ponownie poźniej lub skontaktuj sięz administratorem"});
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
      return BadRequest(new {state = false, message = "Błąd: Email jest pusty"});
    }
    if(string.IsNullOrEmpty(request.Password))
    {
      return BadRequest(new {state = false, message = "Błąd: Hasło jest puste"});
    }
    if(string.IsNullOrEmpty(request.Role))
    {
      request.Role = "Free";
    }


    try 
    {
      await _usersService.LoginUserAsync(request);

      var accessToken = _tokenService.GenerateAccessToken(request.Id, request.Role, request.Email);
      var refreshToken = _tokenService.GenerateRefreshToken();

      Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
      {
        HttpOnly = true,
        Secure = false,
        SameSite = SameSiteMode.Strict,
        Expires = DateTime.Now.AddDays(7)
      });

      return Ok(new {state = true, message = "Użytkownik został zalogowany", accessToken});
    }
    catch(ArgumentException error)
    {
      _logger.LogError("Error while creating a user" + error.Message);
      return BadRequest(new {state = false, message = error.Message});
    }
    catch(UserNotFoundException error)
    {
      _logger.LogError("User with login {Login} not found", request.Email + error.Message);
      return NotFound(new {state = false, message = "Nie znaleziono użytkownika o takim emailu"});
    }
    catch(Exception error)
    {
      _logger.LogError("Error while creating a user" + error.Message);
      return StatusCode(500, new {state = false, message = "Błąd przy tworzeniu użytkownika"});
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
      return BadRequest(new {state = false, message = "Błąd: Email jest pusty"});
    }
    if(string.IsNullOrEmpty(request.Role))
    {
      return BadRequest(new {state = false, message = "Błąd: Rola jest pusta"});
    }

    try
    {
      var subscriptionDetails = await _usersService.GetSubscriptionDetailsModelAsync(request.Email);

      if(subscriptionDetails == null)
      {
        return NotFound(new {state = false, message = "Nie znaleziono subskrypcji"});
      }


      var currentDate = DateTime.UtcNow;
      if(subscriptionDetails.Expiration_date < currentDate)
      {
        await _usersService.UpdateSubsciprionDetails(request.Email);
        await _usersService.UpdateUserAsync(request.Email, "Free");
        _logger.LogInformation("Subscription expired for user {Email}", request.Email);
        subscriptionDetails = await _usersService.GetSubscriptionDetailsModelAsync(request.Email);
      }

      var subscriptionToken = _tokenService.GenerateSubscriptionToken(subscriptionDetails);


      if(subscriptionDetails.Last_payment_status == "unpaid")
      {
        return Ok(new { state = true, message = "Oczekiwanie na płatność", subscriptionToken, isActive = false, paymentStatus = "unpaid"});
      }

      if(subscriptionDetails.Status == "inactive")
      {
        return Ok(new { state = true, message = "Subskrypcja nieaktywna", subscriptionToken, isActive = false});
      }

      return Ok(new {state = true, message = "Dane subskrypcji", subscriptionToken, isActive = true});
    }
    catch(ArgumentException error)
    {
      _logger.LogError("Error while getting subscription details" + error.Message);
      return BadRequest(new {state = false, message = "Błędne dane"});
    }
    catch(Exception error)
    {
      _logger.LogError("Error while getting subscription details" + error.Message);
      return StatusCode(500, new {state = false, message = "Błąd przy pobieraniu danych subskrypcji"});
    }
  }

  [HttpPut("subscription")]
  public async Task<IActionResult> UpdateUserSubscription([FromBody] SubscriptionRequest request)
  {
    
    if(request == null)
    {
      _logger.LogError("BadRequest: Request is missing");
      return BadRequest(new {state = false, message = "Brak danych!"});
    }

    _logger.LogInformation("Updating user subscription for {Email} with role {Role}", request.Email, request.Role);
    if(string.IsNullOrEmpty(request.Email))
    {
      return BadRequest(new {state = false, message = "Błąd: Email jest pusty"});
    }
    if(string.IsNullOrEmpty(request.Role))
    {
      return BadRequest(new {state = false, message = "Błąd: Rola jest pusta"});
    }

    try
    {
      await _usersService.UpdateUserAsync(request.Email, request.Role);
      return Ok(new {state = true, message = "Użytkownik został zaktualizowany"});
    }
    catch(ArgumentException error)
    {
      _logger.LogError("Error while updating user" + error.Message);
      return BadRequest(new {state = false, message = error.Message});
    }
    catch(UserNotFoundException error)
    {
      _logger.LogError("User with login {Login} not found", request.Email + error.Message);
      return NotFound(new {state = false, message = "Nie znaleziono użytkownika"});
    }
  }
}


public class SubscriptionRequest 
{
  public string? Email { get; set; }
  public string? Role { get; set; }
}