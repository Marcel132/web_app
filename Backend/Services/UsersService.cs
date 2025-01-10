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

// ! Error: status 409 is sending as status 500. Repair
 public async Task RegisterUserAsync(UsersModel newUser)
 {
  string password = newUser.password;

  if(string.IsNullOrEmpty(password))
  {
    _logger.LogWarning("Password is missing");
   throw new ArgumentException("Password is missing");
  }

  newUser.password = BCrypt.Net.BCrypt.HashPassword(password);

  var existingUser = await _users.Find(user => user.login == newUser.login).FirstOrDefaultAsync();
  if(existingUser != null)
  {
    _logger.LogError("User with login {Login} already exists", newUser.login);
    throw new UserAlreadyExistsException("User already exists");
  }
  try 
  {
    await _users.InsertOneAsync(newUser);
    _logger.LogInformation("User {Login} created", newUser.login);

  }
  catch(Exception  error)
  {
    _logger.LogError("Error while creating a user");
    throw new Exception("Error while creating a user" + " " + error);
  }
 } 
}