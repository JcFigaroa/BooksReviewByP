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
    public class BookService : IBookService
    {
        private readonly IBookRepository _bookRepo;
        private readonly IBookGenreRepository _bookGenreRepo;

        public BookService(IBookRepository bookRepo, IBookGenreRepository bookGenreRepo)
        {
            _bookRepo = bookRepo;
            _bookGenreRepo = bookGenreRepo;
        }

        public Task<Book?> GetByIdAsync(int id) => _bookRepo.GetByIdAsync(id);

        public Task<List<Book>> GetAllAsync() => _bookRepo.GetAllAsync();

        public async Task<Book> CreateAsync(Book book, List<int> genreIds)
        {
            BookValidator.ValidateBook(book, genreIds);

            var existingBook = await _bookRepo.GetByTitleAsync(book.Title);
            if (existingBook != null)
                throw new InvalidOperationException("A book with the same title already exists.");

            foreach (var genreId in genreIds)
            {
                await _bookGenreRepo.AddAsync(new BookGenre
                {
                    BookId = book.Id,
                    GenreId = genreId
                });
            }

            await _bookRepo.AddAsync(book);

            return book;
        }

        public async Task<Book?> UpdateAsync(Book book, List<int> genreIds)
        {
            BookValidator.ValidateBook(book, genreIds);

            var existingBookWithTitle = await _bookRepo.GetByTitleAsync(book.Title);
            if (existingBookWithTitle != null && existingBookWithTitle.Id != book.Id)
                throw new InvalidOperationException("A book with the same title already exists.");

            var existing = await _bookRepo.GetByIdAsync(book.Id);
            if (existing == null) return null;


            existing.Title = book.Title;
            existing.Author = book.Author;
            existing.Description = book.Description;
            

            await _bookRepo.UpdateAsync(existing);

            var currentGenres = await _bookGenreRepo.GetByBookIdAsync(book.Id);

            foreach (var bg in currentGenres)
                await _bookGenreRepo.DeleteAsync(book.Id, bg.GenreId);

            foreach (var genreId in genreIds)
                await _bookGenreRepo.AddAsync(new BookGenre { BookId = book.Id, GenreId = genreId });

            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            if (id <= 0) throw new ArgumentException("Invalid book ID.");
            var existing = await _bookRepo.GetByIdAsync(id);
            if (existing == null) return false;

            await _bookRepo.DeleteAsync(id);
            return true;
        }
    }
}
