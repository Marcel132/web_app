using MongoDB.Driver;
using BCrypt.Net;

public class UserAlreadyExistsException : Exception
{
    public UserAlreadyExistsException(string message) : base(message) { }
}

public class UsersService
{
 private readonly IMongoCollection<UsersModel> _users;
 private readonly ILogger<UsersService> _logger;

  public UsersService(MongoDBContext context, ILogger<UsersService> logger){
    _users = context.GetCollection<UsersModel>("Users");
    _logger = logger;
  } 

  public async Task RegisterUserAsync(UsersModel newUser)
  {
    string password = newUser.password;

    if(string.IsNullOrEmpty(password))
    {
      _logger.LogWarning("Data is missing");
      throw new ArgumentException("Brak danych");
    }

    newUser.password = BCrypt.Net.BCrypt.HashPassword(password);

    var existingUser = await _users.Find(user => user.login == newUser.login).FirstOrDefaultAsync();
    if(existingUser != null)
    {
      _logger.LogError("User with login {Login} already exists", newUser.login);
      throw new UserAlreadyExistsException("Taki użytkownik  już istnieje");
    }
    try 
    {
      await _users.InsertOneAsync(newUser);
      _logger.LogInformation("User {Login} created", newUser.login);

    }
    catch(Exception  error)
    {
      _logger.LogError("Error while creating a user");
      throw new Exception("Błąd przy tworzeniu użytkownika" + " " + error);
    }
  } 
  public async Task LoginUserAsync(UsersModel existingUser)
  {

    if(existingUser.login == null || existingUser.password == null)
    {
      _logger.LogWarning("Data is missing");
      throw new ArgumentException("Brak danych");
    }

    try
    {
      var isUserExists = await _users.Find(user => user.login == existingUser.login).FirstOrDefaultAsync();

      bool validPassword =  BCrypt.Net.BCrypt.Verify(existingUser.password, isUserExists.password);
      if(!validPassword == true)
      {
        _logger.LogError("Error while verifying password");
        throw new Exception("Błąd przy weryfikacji hasła");
      }
    }
    catch(Exception error)
    {
      _logger.LogError("Error while logging in");
      throw new Exception("Błąd przy logowaniu" + " " + error);
    }
  }
}
