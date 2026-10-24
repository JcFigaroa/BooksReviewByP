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
    public class CommentRepository : ICommentRepository
    {
        private readonly BooksByPDbContext _context;

        public CommentRepository(BooksByPDbContext context)
        {
            _context = context;
        }

        public async Task<Comment?> GetByIdAsync(int id)
            => await _context.Comments
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == id);

        public async Task<List<Comment>> GetByBookIdAsync(int bookId)
            => await _context.Comments
                .Include(c => c.User)
                .Where(c => c.BookId == bookId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

        public async Task AddAsync(Comment comment)
        {
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var comment = await GetByIdAsync(id);
            if (comment != null)
            {
                _context.Comments.Remove(comment);
                await _context.SaveChangesAsync();
            }
        }
    }
}
