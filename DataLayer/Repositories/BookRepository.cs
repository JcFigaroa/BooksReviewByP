using DataLayer.DbContext;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using DataLayer.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Repositories
{
    public class BookRepository : IBookRepository
    {
        private readonly BooksByPDbContext _context;

        public BookRepository(BooksByPDbContext context)
        {
            _context = context;
        }

        public async Task<Book?> GetByIdAsync(int id)
            => await _context.Books
                .Include(b => b.BookGenres)
                .ThenInclude(bg => bg.Genre)
                .Include(b => b.Comments)
                .FirstOrDefaultAsync(b => b.Id == id);

        public async Task<List<Book>> GetAllAsync()
            => await _context.Books
                .Include(b => b.BookGenres)
                .ThenInclude(bg => bg.Genre)
                .ToListAsync();

        public async Task AddAsync(Book book)
        {
            _context.Books.Add(book);
            await _context.SaveChangesAsync();
            Console.WriteLine("BOOK ID AFTER SAVE: " + book.Id);

        }

        public async Task UpdateAsync(Book book)
        {
            _context.Books.Update(book);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var book = await GetByIdAsync(id);
            if (book != null)
            {
                _context.Books.Remove(book);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Book?> GetByTitleAsync(string title)
        {
            return await _context.Books
                .Include(b => b.BookGenres)
                .ThenInclude(bg => bg.Genre)
                .FirstOrDefaultAsync(b => b.Title.ToLower() == title.ToLower());
        }
    }
}
