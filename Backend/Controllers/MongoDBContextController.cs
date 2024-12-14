using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

[ApiController]
[Route("api/test")]
public class TestController : ControllerBase 
{
  private readonly MongoDBContext _mongoDBContext;

  public TestController(MongoDBContext mongoDBContext)
  {
    _mongoDBContext = mongoDBContext;
  }

  [HttpGet] 
  public IActionResult TestConnection()
  {
    return Ok("MongoDBContext Zarejestrowany w DI: Poprawnie");
  }
}