using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

public class UsersModel 
{
  [BsonId] 
  [BsonRepresentation(BsonType.ObjectId)]
  public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

  [BsonElement("email")]
  public string? Email { get; set;}

  [BsonElement("password")]
  public string? Password { get; set;}

  [BsonElement("role")]
  public string? Role { get; set;} = "Free";

}