using AutoMapper;
using BusinessLayer.Interfaces;
using Domain.DTOs;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BooksReviewByPamela.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _service;
    private readonly IMapper _mapper;

    public CommentsController(ICommentService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [HttpGet("book/{bookId}")]
    public async Task<IActionResult> GetByBook(int bookId)
    {
        var comments =
            await _service.GetByBookIdAsync(bookId);

        var response =
            _mapper.Map<List<CommentResponseDto>>(comments);

        return Ok(response);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(CommentDto dto)
    {
        try
        {
            var comment = _mapper.Map<Comment>(dto);

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            comment.UserId = userId;

            await _service.CreateAsync(comment);

            var createdComment = await _service.GetByIdAsync(comment.Id);

            var response =
                _mapper.Map<CommentResponseDto>(createdComment);

            return Ok(response);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var comment = await _service.GetByIdAsync(id);

            if (comment == null)
                return NotFound();

            var currentUserId =
                int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var isAdmin =
                User.FindFirst("isAdmin")?.Value == "True";

            if (!isAdmin && comment.UserId != currentUserId)
                return Forbid();

            await _service.DeleteAsync(id);

            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
