var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSingleton<MongoDBContext>();
builder.Services.AddScoped<FoodService>();

var app = builder.Build();

app.UseRouting();
app.MapControllers();

app.Run();