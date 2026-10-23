using DataLayer.DbContext;
using Domain.Entities;
using DataLayer.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Repositories
{
    public class GenreRepository : IGenreRepository
    {
        private readonly BooksByPDbContext _context;

        public GenreRepository(BooksByPDbContext context)
        {
            _context = context;
        }

        public async Task<Genre?> GetByIdAsync(int id)
            => await _context.Genres.FindAsync(id);

        public async Task<List<Genre>> GetAllAsync()
            => await _context.Genres.ToListAsync();

        public async Task AddAsync(Genre genre)
        {
            _context.Genres.Add(genre);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Genre genre)
        {
            _context.Genres.Update(genre);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var genre = await GetByIdAsync(id);
            if (genre != null)
            {
                _context.Genres.Remove(genre);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Genre?> GetByNameAsync(string name)
        {
            return await _context.Genres
                .FirstOrDefaultAsync(g =>
                    g.Name.ToLower() == name.ToLower());
        }
    }
}
