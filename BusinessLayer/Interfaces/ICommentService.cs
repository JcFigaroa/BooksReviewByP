using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Interfaces
{
    public interface ICommentService
    {
        Task<List<Comment>> GetByBookIdAsync(int bookId);
        Task<Comment> CreateAsync(Comment comment);
        Task<bool> DeleteAsync(int id);
    }
}
