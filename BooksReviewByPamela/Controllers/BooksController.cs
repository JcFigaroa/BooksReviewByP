using BusinessLayer.Interfaces;
using Domain.DTOs;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Microsoft.AspNetCore.StaticFiles;

namespace BooksReviewByPamela.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly IBookService _service;
    private readonly IMapper _mapper;


    public BooksController(IBookService service, IMapper mapper)
    {
        _service = service;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var book = await _service.GetByIdAsync(id);
        return book == null ? NotFound() : Ok(book);
    }

    [HttpPost]
    public async Task<IActionResult> Create(BookDto dto)
    {
        try
        {
            var book = _mapper.Map<Book>(dto);
            book.UserId = 1;

            await _service.CreateAsync(book, dto.GenreIds);

            return CreatedAtAction(nameof(Get), new { id = book.Id }, book);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }

        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, BookDto dto)
    {
        Console.WriteLine($"Updating book id = {id}");
        var book = _mapper.Map<Book>(dto);
        book.UserId = 1;
        book.Id = id;

        var updated = await _service.UpdateAsync(book, dto.GenreIds);
        return updated == null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
        => await _service.DeleteAsync(id) ? NoContent() : NotFound();

    [HttpPost("{id}/image")]
    public async Task<IActionResult> UploadImage(int id, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        var book = await _service.GetByIdAsync(id);

        if (book == null)
            return NotFound();

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

        var uploadsFolder = Path.Combine(
            Directory.GetCurrentDirectory(),
            "wwwroot",
            "images",
            "books");

        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var filePath = Path.Combine(uploadsFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        book.ImagePath = $"/images/books/{fileName}";

        await _service.UpdateAsync(book, book.BookGenres.Select(bg => bg.GenreId).ToList());

        return Ok(new
        {
            imagePath = book.ImagePath
        });
    }

}
