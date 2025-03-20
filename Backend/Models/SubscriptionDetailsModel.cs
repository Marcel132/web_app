using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class SubscriptionDetailsModel 
{
  [BsonId] 
  [BsonRepresentation(BsonType.ObjectId)]
  public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

  [BsonElement("email")]
  [EmailAddress]
  public string? Email { get; set;}

  [BsonElement("purchase_date")]
  public DateTime? Purchase_date { get; set;}

  [BsonElement("expiration_date")]
  public DateTime? Expiration_date { get; set;}

  [BsonElement("payment_method")]
  public string? Payment_method { get; set;}

  [BsonElement("price")]
  public double? Price { get; set;}
  
  [BsonElement("status")]
  public string? Status { get; set;} = "inactive";

  [BsonElement("last_payment_status")]
  public string? Last_payment_status { get; set;} = "unpaid";

  [BsonElement("recurring_payment")]
  public bool? Reccuring_payment { get; set;} = false;

  [BsonElement("payment_history")]
  public PaymentHistory? Payment_history { get; set;}
} 

public class PaymentHistory
{
  [BsonElement("date")]
  public DateTime? Date { get; set; }

  [BsonElement("status")]
  public string? Status { get; set; }

  [BsonElement("amount")]
  public double? Price { get; set; }
  
  [BsonElement("payment_method")]
  public string? Payment_method { get; set; }
}