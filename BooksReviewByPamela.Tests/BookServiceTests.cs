using BusinessLayer.Interfaces;
using BusinessLayer.Services;
using DataLayer.Interfaces;
using Domain.Entities;
using Moq;


namespace BooksReviewByPamela.Tests
{
    public class BookServiceTests
    {
        [Fact]
        public async Task CreateAsync_ShouldThrow_WhenTitleIsEmpty()
        {
            // Arrange

            var bookRepo = new Mock<IBookRepository>();
            var bookGenreRepo = new Mock<IBookGenreRepository>();

            var service = new BookService(
                bookRepo.Object,
                bookGenreRepo.Object);

            var book = new Book
            {
                Title = "",
                Author = "Jean",
                Description =
                    "This description is more than twenty characters."
            };

            // Act & Assert

            await Assert.ThrowsAsync<ArgumentException>(
                () => service.CreateAsync(book, new List<int> { 1 }));
        }
    }
}
