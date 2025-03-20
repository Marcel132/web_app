using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;

public class TokenService
{

  private readonly string _key;

  public TokenService(IConfiguration configuration)
  {
    _key = configuration["Jwt:Key"] ?? throw new ArgumentNullException("Jwt:Key is missing in configuration");
  }

  public string GenerateAccessToken(string userId, string role, string email)
  {
    var claims = new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, userId),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim(ClaimTypes.Role, role),
        new Claim(ClaimTypes.Email, email)
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var authToken = new JwtSecurityToken(
        issuer: "http://foodcalories/",
        audience: "http://foodcalories/",
        claims: claims,
        expires: DateTime.Now.AddMinutes(15),
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(authToken);
  }

  public string GeneratePacksPackageToken(SubscriptionDetailsModel package)
  {

    if(string.IsNullOrEmpty(package.Email)){
      throw new Exception("Paczka nie ma wartości" + package.Email);
    }
    
    var claims = new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, package.Email),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim("purchase_date", package.Purchase_date.Value.ToString("o")),
        new Claim("expiration_date", package.Expiration_date.Value.ToString("o")),
        new Claim("payment_method", package.Payment_method),
        new Claim("price", package.Price.ToString()),
        new Claim("status", package.Status),
        new Claim("last_payment_status", package.Last_payment_status),
        new Claim("recurring_payment", package.Reccuring_payment.ToString()),
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var authToken = new JwtSecurityToken(
        issuer: "http://foodcalories/",
        audience: "http://foodcalories/",
        claims: claims,
        expires: DateTime.Now.AddMinutes(15),
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(authToken); 
  } 
  public string GenerateRefreshToken()
  {
    var randomNumber = new byte[32];
    using (var rng = RandomNumberGenerator.Create())
    {
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }
  }
}
