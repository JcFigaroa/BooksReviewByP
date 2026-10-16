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
    public class BookGenreRepository : IBookGenreRepository
    {
        private readonly BooksByPDbContext _context;

        public BookGenreRepository(BooksByPDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(BookGenre bookGenre)
        {
            _context.BookGenres.Add(bookGenre);
            await _context.SaveChangesAsync();
        }

        public async Task<List<BookGenre>> GetByBookIdAsync(int bookId)
            => await _context.BookGenres
                .Where(bg => bg.BookId == bookId)
                .Include(bg => bg.Genre)
                .ToListAsync();

        public async Task DeleteAsync(int bookId, int genreId)
        {
            var entity = await _context.BookGenres
                .FirstOrDefaultAsync(bg => bg.BookId == bookId && bg.GenreId == genreId);

            if (entity != null)
            {
                _context.BookGenres.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}
