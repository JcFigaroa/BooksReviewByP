using BusinessLayer.Interfaces;
using Domain.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace BooksReviewByPamela.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly ILoginService _loginService;

        public LoginController(ILoginService loginService)
        {
            _loginService = loginService;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var token = await _loginService.LoginAsync(dto);

            if (token == null)
                return Unauthorized("Invalid email or password");

            return Ok(new { token });
        }
    }
}
