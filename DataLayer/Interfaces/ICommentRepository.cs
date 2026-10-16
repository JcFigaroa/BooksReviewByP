using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Interfaces
{
    public interface ICommentRepository
    {
        Task<Comment?> GetByIdAsync(int id);
        Task<List<Comment>> GetByBookIdAsync(int bookId);
        Task AddAsync(Comment comment);
        Task DeleteAsync(int id);
    }
}
