using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Interfaces
{
    public interface IBookService
    {
        Task<Book?> GetByIdAsync(int id);
        Task<List<Book>> GetAllAsync();
        Task<Book> CreateAsync(Book book, List<int> genreIds);
        Task<Book?> UpdateAsync(Book book, List<int> genreIds);
        Task<bool> DeleteAsync(int id);
    }
}
