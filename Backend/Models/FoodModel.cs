using System.Globalization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

public class FoodModel
{
  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]
  public string Id { get; set; }

  [BsonElement("id_prod")]
  [Required]
  public int Id_prod { get; set; }

  [BsonElement("name")]
  [Required]
  public string Name { get; set; }

  [BsonElement("details")]
  [Required]
  public FoodDetalis Details { get; set;}
}

public class FoodDetalis 
{
  [BsonElement("kcal")]
  [Range(0, float.MaxValue)]
  [Required]
  public double Kcal { get; set;}

  [BsonElement("proteins")]
  [Range(0, float.MaxValue)]
  [Required]
  public double Proteins { get; set; } 

  [BsonElement("fats")]
  [Range(0, float.MaxValue)]
  [Required]
  public double Fats { get; set; }

  [BsonElement("carbohydrates")]
  [Range(0, float.MaxValue)]
  [Required]
  public double Carbohydrates { get; set; }
}