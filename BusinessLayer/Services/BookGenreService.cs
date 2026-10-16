using DataLayer.Interfaces;
using Domain.Entities;
using BusinessLayer.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Services
{
    public class BookGenreService : IBookGenreService
    {
        private readonly IBookGenreRepository _repo;

        public BookGenreService(IBookGenreRepository repo)
        {
            _repo = repo;
        }

        public Task<List<BookGenre>> GetByBookIdAsync(int bookId)
            => _repo.GetByBookIdAsync(bookId);

        public async Task AddGenresToBookAsync(int bookId, List<int> genreIds)
        {
            foreach (var id in genreIds)
            {
                await _repo.AddAsync(new BookGenre
                {
                    BookId = bookId,
                    GenreId = id
                });
            }
        }

        public Task RemoveGenreFromBookAsync(int bookId, int genreId)
            => _repo.DeleteAsync(bookId, genreId);
    }
}
