using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Interfaces
{
    public interface IBookGenreService
    {
        Task<List<BookGenre>> GetByBookIdAsync(int bookId);
        Task AddGenresToBookAsync(int bookId, List<int> genreIds);
        Task RemoveGenreFromBookAsync(int bookId, int genreId);
    }
}
