using MongoDB.Driver;
using BCrypt.Net;

public class UserAlreadyExistsException : Exception
{
    public UserAlreadyExistsException(string message) : base(message) { }
}

public class UserArentExistisException : Exception
{
  public UserArentExistisException(string message) : base(message) { }
}

public class UsersService
{
 private readonly IMongoCollection<UsersModel> _users;
 private readonly IMongoCollection<UserDataModel> _userData;
 private readonly ILogger<UsersService> _logger;

  public UsersService(MongoDBContext context, ILogger<UsersService> logger){
    _users = context.GetCollection<UsersModel>("Users");
    _userData = context.GetCollection<UserDataModel>("UserData");
    _logger = logger;
  } 

  public async Task RegisterUserAsync(UsersModel newUser)
  {
    string password = newUser.Password;

    if(string.IsNullOrEmpty(password))
    {
      _logger.LogWarning("Data is missing");
      throw new ArgumentException("Brak danych");
    }

    newUser.Password = BCrypt.Net.BCrypt.HashPassword(password);

    var existingUser = await _users.Find(user => user.Login == newUser.Login).FirstOrDefaultAsync();
    if(existingUser != null)
    {
      _logger.LogError("User with login {Login} already exists", newUser.Login);
      throw new UserAlreadyExistsException("Taki użytkownik  już istnieje");
    }
    try 
    {
      await _users.InsertOneAsync(newUser);
      _logger.LogInformation("User {Login} created", newUser.Login);

    }
    catch(Exception  error)
    {
      _logger.LogError("Error while creating a user");
      throw new Exception("Błąd przy tworzeniu użytkownika" + " " + error);
    }
  } 
  public async Task LoginUserAsync(UsersModel existingUser)
  {

    if(existingUser.Login == null || existingUser.Password == null)
    {
      _logger.LogWarning("Data is missing");
      throw new ArgumentException("Brak danych");
    }
    

    try
    {
      var isUserExists = await _users.Find(user => user.Login == existingUser.Login).FirstOrDefaultAsync();

      if (isUserExists == null)
      {
        _logger.LogWarning("User with login {Login} does not exist", existingUser.Login);
        throw new UserArentExistisException("Nie znaleziono użytkownika");
      }

      bool validPassword =  BCrypt.Net.BCrypt.Verify(existingUser.Password, isUserExists.Password);
      if(!validPassword)
      {
        _logger.LogError("Error while verifying password");
        throw new Exception("Błąd przy weryfikacji hasła");
      }

      existingUser.Role = isUserExists.Role;
    }
    catch(UserArentExistisException error)
    {
      _logger.LogWarning("User with login {Login} does not exist", existingUser.Login);
      throw new UserArentExistisException("Nie znaleziono użytkownika");
    }
    catch(Exception error)
    {
      _logger.LogError("Error while logging in");
      throw new Exception("Błąd przy logowaniu" + " " + error);
    }
  }
  public async Task CreateUserWithDataOfMeals(string userEmail){
    
    if(string.IsNullOrEmpty(userEmail))
    {
      throw new Exception("Error: String is null or empty");
    }

    var existingUser = await _userData.Find(user => user.Email == userEmail).FirstOrDefaultAsync();
    if(existingUser != null)
    {
      _logger.LogError("User with login {Login} already exists", userEmail);
      throw new UserAlreadyExistsException("Taki użytkownik  już istnieje");
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
    await _userData.InsertOneAsync(newUser);
  }
  public async Task<bool> AddMealAsync (string userEmail, Meal newMeal)
  {
    string today = DateTime.UtcNow.ToString("yyyy-MM-dd");

    var filter = Builders<UserDataModel>.Filter.Eq(u => u.Email, userEmail);

    var update = Builders <UserDataModel>.Update
      .Push($"mealsDeatails.{today}", newMeal);

      var result = await _userData.UpdateOneAsync(filter, update);

      return result.ModifiedCount > 0;
  }
  public async Task UpdateUserData (string userEmail, UserDataModel newData)
  {
    if(string.IsNullOrEmpty(userEmail))
    {
      throw new UserArentExistisException("Nie znaleziono użytkownika");
    }

    try
    {
      var existingUser = await _userData.Find(user => user.Email == userEmail).FirstOrDefaultAsync(); 
      var updateDefinition = Builders<UserDataModel>.Update
        .Set(user => user.Weight, newData.Weight != 0 ? newData.Weight : existingUser.Weight)
        .Set(user => user.Height, newData.Height != 0 ? newData.Height : existingUser.Height)
        .Set(user => user.Sex, !string.IsNullOrEmpty(newData.Sex) ? newData.Sex : existingUser.Sex)
        .Set(user => user.Age, newData.Age != 0 ? newData.Age : existingUser.Age);

      var result = await _userData.UpdateOneAsync(
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
}
