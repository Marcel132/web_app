using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class UserDataModel 
{
  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]
  public string? Id { get; set; }

  [BsonElement("email")]
  [Required]
  public string Email { get; set; }

  [BsonElement("weight")]
  public float Weight { get; set; }

  [BsonElement("height")]
  public float Height { get; set; }

  [BsonElement("sex")]
  public string Sex { get; set; }
  
  [BsonElement("age")]
  public int Age { get; set; }

  [BsonElement("mealsDetails")]
  public Dictionary<string, List<Meal>>? MealsDetails{ get; set;} = new();
}

public class Meal
{
    [BsonElement("name")]
    public string Name { get; set; }

    [BsonElement("calories")]
    public int Calories { get; set; }

    [BsonElement("proteins")]
    public float Proteins { get; set; }

    [BsonElement("carbohydrates")]
    public float Carbohydrates { get; set; }

    [BsonElement("fats")]
    public float Fats { get; set; }
}