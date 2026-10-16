using BusinessLayer.Interfaces;
using Domain.DTOs;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;

namespace BooksReviewByPamela.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GenresController : ControllerBase
{
    private readonly IGenreService _service;
    private readonly IMapper _mapper;

    public GenresController(IGenreService service, IMapper mapper)
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
        var genre = await _service.GetByIdAsync(id);
        return genre == null ? NotFound() : Ok(genre);
    }

    [HttpPost]
    public async Task<IActionResult> Create(GenreDto dto)
    {
        var genre = _mapper.Map<Genre>(dto);
        await _service.CreateAsync(genre);
        return CreatedAtAction(nameof(Get), new { id = genre.Id }, genre);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, GenreDto dto)
    {
        var updated = await _service.UpdateAsync(_mapper.Map<Genre>(dto));
        return updated == null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
        => await _service.DeleteAsync(id) ? NoContent() : NotFound();
}