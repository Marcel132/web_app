public class MealsModel 
{
  public string Title { get; set; } = "";
  public string Description { get; set; } = "";

  public List<SavedMeal> Meals { get; set; } = new();
}

public class SavedMeal 
{
  public int Id_prod { get; set; }
  public string Name { get; set; } = "";
  public double Weight { get; set; }

  public Details Details { get; set; } = new();
}

public class Details
{
  public double Kcal { get; set; }
  public float Proteins { get; set; }
  public float Fats { get; set; }
  public float Carbohydrates { get; set; }
}