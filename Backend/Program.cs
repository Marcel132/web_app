using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = "https://yourissuer.com",
            ValidAudience = "https://youraudience.com",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("your-secret-key"))
        };
        options.Events = new JwtBearerEvents
        {
          OnAuthenticationFailed = context => 
          {
            context.Response.StatusCode = 401;
            context.Response.ContentType = "application/json";
            return context.Response.WriteAsync(new 
            {
              message = "Authentication failed",
              details = context.Exception.Message
            }.ToString());
          }
        };

    });

builder.Services.AddControllers();
builder.Services.AddSingleton<MongoDBContext>();
builder.Services.AddScoped<FoodService>();

var app = builder.Build();

app.UseAuthorization();
app.UseAuthentication();

app.UseRouting();
app.MapControllers();

app.Run();