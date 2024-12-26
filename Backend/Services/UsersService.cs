using MongoDB.Driver;
using BCrypt.Net;

public class UsersService
{
 private readonly IMongoCollection<UsersModel> _users;

  public UsersService(MongoDBContext context){
    _users = context.GetCollection<UsersModel>("Users");
  } 


 public async Task RegisterUserAsync(UsersModel newUser)
 {
  string password = newUser.password;

  if(string.IsNullOrEmpty(password))
  {
   throw new ArgumentException("Password is missing");
  }

  newUser.password = BCrypt.Net.BCrypt.HashPassword(password);

  try 
  {
    var existingUser = await _users.Find(user => user.login == newUser.login).FirstOrDefaultAsync();
    if(existingUser != null)
    {
      throw new InvalidOperationException("User already exists");
    }

    await _users.InsertOneAsync(newUser);
  } catch(Exception error)
  {
    throw new Exception("Error while creating a user" + " " + error);
  }
 } 
}