using DataLayer.Interfaces;
using Domain.Entities;
using BusinessLayer.Interfaces;
using BusinessLayer.Services.Validations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Services
{
    public class CommentService : ICommentService
    {
        private readonly ICommentRepository _repo;

        public CommentService(ICommentRepository repo)
        {
            _repo = repo;
        }

        public Task<List<Comment>> GetByBookIdAsync(int bookId)
            => _repo.GetByBookIdAsync(bookId);

        public async Task<Comment> CreateAsync(Comment comment)
        {
            CommentValidator.ValidateComment(comment);
            await _repo.AddAsync(comment);
            return comment;
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
