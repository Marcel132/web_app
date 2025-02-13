using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options => 
{
  options.AddPolicy("AllowFrontend", policy => 
  {
    policy.WithOrigins("http://localhost:4200")
          .AllowAnyHeader()
          .AllowAnyMethod()
          .AllowCredentials();
  });
});
// builder.Services.AddAuthentication("Bearer")
//     .AddJwtBearer("Bearer", options =>
//     {
//         options.TokenValidationParameters = new TokenValidationParameters
//         {
//             ValidateIssuer = true,
//             ValidateAudience = true,
//             ValidateLifetime = true,
//             ValidIssuer = "https://yourissuer.com",
//             ValidAudience = "https://youraudience.com",
//             IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("your-secret-key"))
//         };
//         options.Events = new JwtBearerEvents
//         {
//           OnAuthenticationFailed = context => 
//           {
//             context.Response.StatusCode = 401;
//             context.Response.ContentType = "application/json";
//             return context.Response.WriteAsync(new 
//             {
//               message = "Authentication failed",
//               details = context.Exception.Message
//             }.ToString());
//           }
//         };

//     });
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
builder.Services.AddSingleton(sp => sp.GetRequiredService<IOptions<JwtSettings>>().Value);

builder.Services.AddControllers();
builder.Services.AddSingleton<MongoDBContext>();
builder.Services.AddSingleton<AuthService>();
builder.Services.AddSingleton<TokenService>();
builder.Services.AddScoped<FoodService>();
builder.Services.AddScoped<UsersService>();

var app = builder.Build();

// app.UseAuthorization();
// app.UseAuthentication();
app.UseCors("AllowFrontend");
app.UseRouting();
app.MapControllers();

app.Run();