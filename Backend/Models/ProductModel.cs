using System.Globalization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

public class ProductModel
{
  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]
  public string? Id { get; set; }

  [BsonElement("id_prod")]
  public int? Id_prod { get; set; }

  [BsonElement("name")]
  public string? Name { get; set; }

  [BsonElement("details")]
  public ProductDetails? ProductDetails { get; set;}
}

public class ProductDetails
{
  [BsonElement("kcal")]
  [Range(0, float.MaxValue)]
  public double? Kcal { get; set;}

  [BsonElement("proteins")]
  [Range(0, float.MaxValue)]
  public double? Proteins { get; set; }

  [BsonElement("fats")]
  [Range(0, float.MaxValue)]
  public double? Fats { get; set; }
    
  [BsonElement("carbohydrates")]
  [Range(0, float.MaxValue)]
  public double? Carbohydrates { get; set; }
}