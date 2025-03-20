using MongoDB.Driver;
using BCrypt.Net;

public class UserAlreadyExistsException : Exception
{
    public UserAlreadyExistsException(string message) : base(message) { }
}

public class UserNotFoundException : Exception
{
  public UserNotFoundException(string message) : base(message) {}
}

public class UsersService 
{
  private readonly IMongoCollection<UsersModel> _usersModel;
  private readonly IMongoCollection<UserDataModel> _userDataModel;
  private readonly IMongoCollection<SubscriptionDetailsModel> _subscriptionDetailsModel;
  private readonly ILogger<UsersService> _logger;

  public UsersService(MongoDBContext context, ILogger<UsersService> logger)
  {
    _usersModel = context.GetCollection<UsersModel>("Users");
    _userDataModel = context.GetCollection<UserDataModel>("UserData");
    _subscriptionDetailsModel = context.GetCollection<SubscriptionDetailsModel>("SubscriptionDetails");
    _logger = logger;
  }

  public async Task RegisterUserAsync(UsersModel data)
  {
    string password = data.Password;

    try{
      data.Password = BCrypt.Net.BCrypt.HashPassword(password);

      var existingUser = await _usersModel.Find(user => user.Email == data.Email).FirstOrDefaultAsync();

      if(existingUser != null)
      {
        _logger.LogError("User with login {Login} already exists", data.Email);
        throw new UserAlreadyExistsException("Taki użytkownik  już istnieje");
      }

      await _usersModel.InsertOneAsync(data);
      _logger.LogInformation("User {Email created}", data.Email);
      
    }
    catch(Exception  error)
    {
      _logger.LogError("Error while creating a user");
      throw new Exception("Błąd przy tworzeniu użytkownika" + " " + error);
    }
  }
  public async Task CreatedUserDataOfMealsAsync(string userEmail){
    
    if(string.IsNullOrEmpty(userEmail))
    {
      throw new Exception("Error: String is null or empty");
    }

    var newUser = new UserDataModel
    {
      Email = userEmail,
      Weight = 0,
      Height = 0,
      Sex = "Unknown",
      Age = 0,
      MealsDetails = new Dictionary<string, List<Meal>>()
    };
    await _userDataModel.InsertOneAsync(newUser);
  }
  public async Task LoginUserAsync(UsersModel data)
  {
    try
    {
      var isUserExists = await _usersModel.Find(user => user.Email == data.Email).FirstOrDefaultAsync();

      if (isUserExists == null)
      {
        _logger.LogWarning("User with login {Login} does not exist", data.Email);
        throw new UserNotFoundException("Nie znaleziono użytkownika");
      }

      bool validPassword =  BCrypt.Net.BCrypt.Verify(data.Password, isUserExists.Password);
      if(!validPassword)
      {
        _logger.LogError("Error while verifying password");
        throw new Exception("Błąd przy weryfikacji hasła");
      }

      data.Role = isUserExists.Role;
    }
    catch(UserNotFoundException error)
    {
      _logger.LogWarning("User with login {Login} does not exist", data.Email);
      throw new UserNotFoundException("Nie znaleziono użytkownika");
    }
    catch(Exception error)
    {
      _logger.LogError("Error while logging in");
      throw new Exception("Błąd przy logowaniu" + " " + error);
    }
  }
  
  
  public async Task<bool> AddMealAsync (string userEmail, Meal newMeal)
  {
    string today = DateTime.UtcNow.ToString("yyyy-MM-dd");

    var filter = Builders<UserDataModel>.Filter.Eq(u => u.Email, userEmail);

    var update = Builders <UserDataModel>.Update
      .Push($"mealsDeatails.{today}", newMeal);

      var result = await _userDataModel.UpdateOneAsync(filter, update);

      return result.ModifiedCount > 0;
  }
  
  public async Task UpdateUserData (string userEmail, UserDataModel newData)
  {
    if(string.IsNullOrEmpty(userEmail))
    {
      throw new UserAlreadyExistsException("Nie znaleziono użytkownika");
    }

    try
    {
      var existingUser = await _userDataModel.Find(user => user.Email == userEmail).FirstOrDefaultAsync(); 
      var updateDefinition = Builders<UserDataModel>.Update
        .Set(user => user.Weight, newData.Weight != 0 ? newData.Weight : existingUser.Weight)
        .Set(user => user.Height, newData.Height != 0 ? newData.Height : existingUser.Height)
        .Set(user => user.Sex, !string.IsNullOrEmpty(newData.Sex) ? newData.Sex : existingUser.Sex)
        .Set(user => user.Age, newData.Age != 0 ? newData.Age : existingUser.Age);

      var result = await _userDataModel.UpdateOneAsync(
        user => user.Email == userEmail,
        updateDefinition
      );

      if(result.ModifiedCount == 0)
      {
        throw new Exception("Nie zakutalizowano dane");
      }
    }
    catch 
    {
      throw;
    }
  }
  public async Task<SubscriptionDetailsModel> GetSubscriptionDetails(string email)
  {
    _logger.LogInformation("User above: {Email}", email);
    var user = await _subscriptionDetailsModel.Find(user => user.Email == email).FirstOrDefaultAsync();
    _logger.LogInformation("User: {User}", user);
    if(user == null)
    {
      _logger.LogError("User with login {Login} does not exist", email);
      throw new UserAlreadyExistsException("Nie znaleziono użytkownika");
    }

    return user;
  }
}


