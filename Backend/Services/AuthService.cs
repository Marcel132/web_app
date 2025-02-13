using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

public class AuthService
{
    private readonly JwtSettings _jwtSettings;
    private readonly TokenService _tokenService;

    public AuthService(JwtSettings jwtSettings, TokenService tokenService)
    {
        _jwtSettings = jwtSettings;
        _tokenService = tokenService;
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
                ValidateAudience = false,
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

    public string? ValidateAndRefreshToken(string refreshToken, string accessToken)
    {
        if(string.IsNullOrEmpty(refreshToken))
        {
            return null;
        }

        var tokenHandler = new JwtSecurityTokenHandler();
        JwtSecurityToken? jwtToken;

        try {
            jwtToken = tokenHandler.ReadToken(accessToken) as JwtSecurityToken;
            if(jwtToken == null) return null;
        }catch {
            return null;
        }

        var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;
        var role = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
        var email = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

    if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(role) || string.IsNullOrEmpty(email))
    {
        return null;
    }


        var newAccessToken = _tokenService.GenerateAccessToken(userId, role, email);
        return newAccessToken;
    }
}
