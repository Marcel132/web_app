using System.Globalization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class FoodModel
{
  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]
  public string Id { get; set; }
  [BsonElement("id_prod")]
  public int Id_prod { get; set; }
  [BsonElement("name")]
  public string Name { get; set; }
  [BsonElement("details")]
  public FoodDetalis Details { get; set;}
}

public class FoodDetalis 
{
  [BsonElement("kcal")]
  public double Kcal { get; set;}
  [BsonElement("proteins")]
  public double Proteins { get; set; } 
  [BsonElement("fats")]
  public double Fats { get; set; }
  [BsonElement("carbohydrates")]
  public double Carbohydrates { get; set; }
}