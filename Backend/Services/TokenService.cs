using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

public class TokenService
{
  private readonly string _key;
  private readonly ILogger<TokenService> _logger;

  public TokenService(IConfiguration configuration, ILogger<TokenService> logger)
  {
    _logger = logger;
    _key = configuration["Jwt:Key"] ?? throw new ArgumentNullException("Jwt:Key is missing in configuration");
  }

  public string GenerateAccessToken(string userId, string role, string email)
  {
    var claims = new[]
    {
      new Claim(JwtRegisteredClaimNames.Sub, userId),
      new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
      new Claim("role", role),
      new Claim("email", email)
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var accessToken = new JwtSecurityToken(
      issuer: "http://foodcalories/",
      audience: "http://foodcalories/",
      claims: claims,
      expires: DateTime.Now.AddMinutes(15),
      signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(accessToken);
  }

  public string GenerateSubscriptionToken(SubscriptionDetailsModel request)
  {
    if(string.IsNullOrEmpty(request.Email)){
      throw new Exception("Package has no value" + request.Email);
    }

    _logger.LogInformation("Generating token for email: {Email}", request.Email);

    var claims = new[]
    {
      new Claim(JwtRegisteredClaimNames.Sub, request.Email),
      new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
      new Claim("email", request.Email),
      new Claim("purchase_date", request.Purchase_date.Value.ToString("o")),
      new Claim("expiration_date", request.Expiration_date.Value.ToString("o")),
      new Claim("payment_method", request.Payment_method),
      new Claim("price", request.Price.ToString()),
      new Claim("status", request.Status),
      new Claim("last_payment_status", request.Last_payment_status),
      new Claim("recurring_payment", request.Reccuring_payment.ToString()),
      new Claim("payment_history", request.Payment_history.ToString())
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var subscriptionToken = new JwtSecurityToken(
      issuer: "http://foodcalories/",
      audience: "http://foodcalories/",
      claims: claims,
      expires: DateTime.Now.AddMinutes(15),
      signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(subscriptionToken);
  }

  public string GenerateRefreshToken()
  {
    var claims = new Claim[]
    {
      new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
      new Claim("type", "refresh_token")
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var refreshToken = new JwtSecurityToken(
      issuer: "http://foodcalories/",
      audience: "http://foodcalories/",
      claims: claims,
      expires: DateTime.Now.AddDays(7),
      signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(refreshToken);
  }

}