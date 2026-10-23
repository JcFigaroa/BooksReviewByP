using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace BusinessLayer.Services.Validations
{
    public class BookValidator
    {
        public static void ValidateBook(Book book, List<int> genreIds)
        {
            if (string.IsNullOrWhiteSpace(book.Title))
                throw new ArgumentException("Title is required.");

            if (string.IsNullOrWhiteSpace(book.Author))
                throw new ArgumentException("Author is required.");

            if (book.Title.Length > 200)
                throw new ArgumentException("Title cannot exceed 200 characters.");

            if (book.Author.Length > 100)
                throw new ArgumentException("Author cannot exceed 100 characters.");

            if (string.IsNullOrWhiteSpace(book.Description))
                throw new ArgumentException("Description is required.");

            if (book.Description.Length < 20)
                throw new ArgumentException("Description must be at least 20 characters.");

            if (genreIds == null || !genreIds.Any())
                throw new ArgumentException("At least one genre must be selected.");
        }
    }
}
        
    