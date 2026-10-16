using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Interfaces
{
    public interface IBookGenreRepository
    {
        Task AddAsync(BookGenre bookGenre);
        Task<List<BookGenre>> GetByBookIdAsync(int bookId);
        Task DeleteAsync(int bookId, int genreId);
    }
}
