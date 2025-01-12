using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

public class UsersModel 
{
  [BsonId] 
  [BsonRepresentation(BsonType.ObjectId)]
  public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

  [BsonElement("login")]
  public string login { get; set;} = string.Empty;

  [BsonElement("password")]
  public string password { get; set;} = string.Empty;

}