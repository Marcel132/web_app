using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var ipKey = Environment.GetEnvironmentVariable("IP_DEVICE_KEY_FRONTEND") ?? throw new ArgumentNullException("IP_DEVICE_KEY_FRONTEND is missing in environment variables");
builder.Services.AddCors(options => 
{
  options.AddPolicy("AllowFrontend", policy => 
  {
    policy.WithOrigins(ipKey)
          .AllowAnyHeader()
          .AllowAnyMethod()
          .AllowCredentials();
  });
});
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(5000); // HTTP
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
builder.Services.AddSingleton<MealsService>();
builder.Services.AddSingleton<ProductsService>();
builder.Services.AddSingleton<TokenService>();
builder.Services.AddSingleton<UsersService>();


var app = builder.Build();

// app.UseAuthorization();
// app.UseAuthentication();
app.UseCors("AllowFrontend");
app.UseRouting();
app.MapControllers();

app.Run();