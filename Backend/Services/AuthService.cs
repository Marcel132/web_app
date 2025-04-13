using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

public class AuthService
{
    private readonly JwtSettings _jwtSettings;
    private readonly TokenService _tokenService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(JwtSettings jwtSettings, TokenService tokenService, ILogger<AuthService> logger)
    {
        _jwtSettings = jwtSettings;
        _tokenService = tokenService;
        _logger = logger;
    }

    public ClaimsPrincipal? ValidateJwtToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        if(string.IsNullOrEmpty(_jwtSettings.Secret)){
            Console.WriteLine("Error: Secret is null");
            return null;
        }
        var key = Encoding.UTF8.GetBytes(_jwtSettings.Secret);

        try
        {
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = true,
                ClockSkew = TimeSpan.Zero,
                ValidateLifetime = true
            };

            var principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);

            // Sprawdzenie, czy token jest JWT
            if (validatedToken is JwtSecurityToken jwtToken)
            {
                return principal;
            }
        }
        catch
        {
            return null;
        }

        return null;
    }

    public Task<string> ValidateAndRefreshToken(string refreshToken, string accessToken)
    {
        _logger.LogInformation("Validating and refreshing token.");
        _logger.LogInformation(refreshToken, accessToken);
        if(string.IsNullOrEmpty(refreshToken))
        {
            throw new ArgumentNullException("refreshToken", "Refresh token is required.");
        }

        var tokenHandler = new JwtSecurityTokenHandler();
        JwtSecurityToken? jwtToken;

        try {
            jwtToken = tokenHandler.ReadToken(accessToken) as JwtSecurityToken;
            if(jwtToken == null)
            {
                throw new ArgumentNullException("accessToken", "Access token is required.");
            }
        }catch {
            throw;
        }

        var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;
        var role = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
        var email = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

    if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(role) || string.IsNullOrEmpty(email))
    {
        throw new ArgumentNullException("Token claims are missing.", "Access token is required.");
    }
        var newAccessToken = _tokenService.GenerateAccessToken(userId, role, email);
        return Task.FromResult(newAccessToken);
    }

}
