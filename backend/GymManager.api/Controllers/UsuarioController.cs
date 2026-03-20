using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GymManager.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        [HttpGet("{login}")]
    }
}
