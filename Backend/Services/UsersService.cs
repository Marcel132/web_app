
using BCrypt.Net;
using MongoDB.Driver;

public class UserAlreadyExistsException : Exception
{
  public UserAlreadyExistsException(string message) : base(message) {}
}

public class UserNotFoundException : Exception
{
  public UserNotFoundException(string message) : base(message) {}
}

public class UsersService
{
  private readonly IMongoCollection<UsersModel> _usersModel;
  private readonly IMongoCollection<SubscriptionDetailsModel> _subscriptionDetailsModel;
  private readonly ILogger<UsersService> _logger;

  public UsersService(MongoDBContext context, ILogger<UsersService> logger)
  {
    _usersModel = context.GetCollection<UsersModel>("Users");
    _subscriptionDetailsModel = context.GetCollection<SubscriptionDetailsModel>("SubscriptionDetails");
    _logger = logger;
  }

  public async Task RegisterUserAsync(UsersModel request)
  {
    if(string.IsNullOrEmpty(request.Password))
    {
      throw new ArgumentException("Błąd: Hasło jest puste");
    }

    try
    {
      string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
      if(string.IsNullOrEmpty(hashedPassword))
      {
        _logger.LogError("Cannot save password in db", hashedPassword);
        throw new ArgumentException("Nie można zapisać hasła");
      }

      var existingUser = await _usersModel.Find(user => user.Email == request.Email).FirstOrDefaultAsync();

      if(existingUser != null)
      {
        _logger.LogError("User with login {Login} already exists", request.Email);
        throw new UserAlreadyExistsException("Taki użytkownik już istnieje");
      }

      request.Password = hashedPassword;
      await _usersModel.InsertOneAsync(request);
      _logger.LogInformation("User {Email created}", request.Email);
    }
    catch(Exception error)
    {
      _logger.LogError("Error while creating a user: {Error}", error.Message);
      throw;
    }
  }

  public async Task LoginUserAsync(UsersModel request)
  {
    if(string.IsNullOrEmpty(request.Password))
    {
      throw new ArgumentException("Błąd: Hasło jest puste");
    }
    if(string.IsNullOrEmpty(request.Email))
    {
      throw new ArgumentException("Błąd: Email jest pusty");
    }

    try
    {

      var user = await _usersModel.Find(user => user.Email == request.Email).FirstOrDefaultAsync();

      request.Role = user.Role;

      _logger.LogInformation(request.Role);
      if(user == null)
      {
        _logger.LogError("User with login {Login} not found", request.Email);
        throw new UserNotFoundException("Taki użytkownik nie istnieje");
      }

      if(!BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
      {
        _logger.LogError("Invalid password for user {Login}", request.Email);
        throw new ArgumentException("Nieprawidłowe hasło");
      }
    }
    catch(Exception error)
    {
      _logger.LogError("Error while logging in {Error}", error.Message);
      throw;
    }
  }

  public async Task<SubscriptionDetailsModel> GetSubscriptionDetailsModelAsync(string email)
  {
    if(string.IsNullOrEmpty(email))
    {
      throw new ArgumentException("Błąd: Email jest pusty");
    }

    try
    {
      var subscriptionDetails = await _subscriptionDetailsModel.Find(subscription => subscription.Email == email).FirstOrDefaultAsync();

      if(subscriptionDetails == null)
      {
        _logger.LogError("Subscription details for user {Login} not found", email);
        throw new UserNotFoundException("Nie znaleziono szczegółów subskrypcji");
      }

      return subscriptionDetails;
    }
    catch(Exception error)
    {
      _logger.LogError("Error while getting subscription details {Error}", error.Message);
      throw;
    }
  }

  public async Task UpdateUserAsync(string email, string role)
  {
    if(string.IsNullOrEmpty(email))
    {
      throw new ArgumentException("Błąd: Email jest pusty");
    }

    if(string.IsNullOrEmpty(role))
    {
      throw new ArgumentException("Błąd: Rola jest pusta");
    }

    try
    {
      var existingUser = await _usersModel.Find(user => user.Email == email).FirstOrDefaultAsync();

      if(existingUser == null)
      {
        _logger.LogError("User with login {Login} not found", email);
        throw new UserNotFoundException("Nie znaleziono użytkownika");
      }

      var update = Builders<UsersModel>.Update.Set(user => user.Role, role);
      await _usersModel.UpdateOneAsync(user => user.Email == email, update);
    }
    catch(Exception error)
    {
      _logger.LogError("Error while updating user {Error}", error.Message);
      throw;
    }
  }

  internal async Task<List<UsersModel>> GetAllUsersAsync()
  {
    return await _usersModel
      .Find(user => true)
      .SortBy(user => user.Email)
      .ToListAsync();
  }
}