using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DotNetEnv;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);
Env.Load(); // Load environment variables from .env file
var ipKey = Environment.GetEnvironmentVariable("IP_DEVICE_KEY_FRONTEND") 
        ?? throw new ArgumentNullException("IP_DEVICE_KEY_FRONTEND is missing in environment variables");

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

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(options => 
  {
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),

        RoleClaimType = ClaimTypes.Role,
    };
  });

builder.Services.AddAuthorization();
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
builder.Services.AddSingleton(sp => sp.GetRequiredService<IOptions<JwtSettings>>().Value);

builder.Services.AddControllers();
builder.Services.AddSingleton<MongoDBContext>();
builder.Services.AddSingleton<MealsService>();
builder.Services.AddSingleton<ProductsService>();
builder.Services.AddSingleton<TokenService>();
builder.Services.AddSingleton<UsersService>();
builder.Services.AddSingleton<AuthService>();


var app = builder.Build();


Console.WriteLine("Listening on: " + builder.WebHost.GetSetting("urls"));
app.UseRouting();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();