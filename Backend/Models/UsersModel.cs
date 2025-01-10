using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

public class UsersModel 
{
  [BsonElement("login")]
  public string login { get; set;} = string.Empty;

  [BsonElement("password")]
  public string password { get; set;} = string.Empty;

	[BsonElement("uid")]
	public string uid { get; set;} = ObjectId.GenerateNewId().ToString();
}