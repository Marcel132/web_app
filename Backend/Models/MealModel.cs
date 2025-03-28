using System.Globalization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;
public class MealModel {

  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]
  public string? Id { get; set; }

  [BsonElement("email")]
  public string? Email { get; set; }

  [BsonElement("details")]
  public List<SavedMeal> Details { get; set; } = new();
}

public class SavedMeal 
{
  [BsonElement("title")]
  public string? Title { get; set; }

  [BsonElement("description")]
  public string? Description { get; set; }

  [BsonElement("date")]
  public DateTime Date { get; set; } = DateTime.UtcNow;

  [BsonElement("meals")]
  public List<SavedProducts> Meals { get; set; } = new();
}

public class SavedProducts
{
  [BsonElement("id_prod")]
  public int Id_prod { get; set; }

  [BsonElement("name")]
  public string? Name { get; set; }

  [BsonElement("weight")]
  public double? Weight { get; set; }

  [BsonElement("details")]
  public ProductDetails? ProductDetails { get; set; } = new();
}


// public class ProductDetails
// {
//   [BsonElement("kcal")]
//   [Range(0, float.MaxValue)]
//   public double? Kcal { get; set;}

//   [BsonElement("proteins")]
//   [Range(0, float.MaxValue)]
//   public double? Proteins { get; set; }

//   [BsonElement("fats")]
//   [Range(0, float.MaxValue)]
//   public double? Fats { get; set; }
    
//   [BsonElement("carbohydrates")]
//   [Range(0, float.MaxValue)]
//   public double? Carbohydrates { get; set; }
// }