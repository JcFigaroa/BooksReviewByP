using DataLayer.Interfaces;
using Domain.Entities;
using BusinessLayer.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessLayer.Services.Validations;

namespace BusinessLayer.Services
{
    public class GenreService : IGenreService
    {
        private readonly IGenreRepository _repo;

        public GenreService(IGenreRepository repo)
        {
            _repo = repo;
        }

        public Task<Genre?> GetByIdAsync(int id) => _repo.GetByIdAsync(id);

        public Task<List<Genre>> GetAllAsync() => _repo.GetAllAsync();

        public async Task<Genre> CreateAsync(Genre genre)
        {
            ValidateGenre.ValidateGenreData(genre);

            var existing = await _repo.GetByIdAsync(genre.Id);
            if (existing != null)
            {
                throw new ArgumentException($"Genre with ID {genre.Id} already exists.");
            }

            var existingByName = await _repo.GetByNameAsync(genre.Name);
            if (existingByName != null)
            {
                throw new ArgumentException($"Genre with name '{genre.Name}' already exists.");
            }

            await _repo.AddAsync(genre);
            return genre;
        }

        public async Task<Genre?> UpdateAsync(Genre genre)
        {

            ValidateGenre.ValidateGenreData(genre);

            var existingByName = await _repo.GetByNameAsync(genre.Name);
            if (existingByName != null && existingByName.Id != genre.Id)
            {
                throw new ArgumentException($"Genre with name '{genre.Name}' already exists.");
            }

            var existing = await _repo.GetByIdAsync(genre.Id);
            if (existing == null) return null;

            existing.Name = genre.Name;
            existing.Id = genre.Id;


            await _repo.UpdateAsync(existing);
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {

            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return false;

            await _repo.DeleteAsync(id);
            return true;
        }
    }
}
