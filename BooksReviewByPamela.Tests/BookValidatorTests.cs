using BusinessLayer.Services.Validations;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BooksReviewByPamela.Tests;

public class BookValidatorTests
{
    private Book CreateValidBook()
    {
        return new Book
        {
            Title = "Harry Potter",
            Author = "J.K. Rowling",
            Description = "This description contains more than twenty characters."
        };
    }

    [Fact]
    public void ValidateBook_ShouldThrow_WhenTitleIsEmpty()
    {
        var book = CreateValidBook();
        book.Title = "";

        Assert.Throws<ArgumentException>(() =>
            BookValidator.ValidateBook(book, new List<int> { 1 }));
    }

    [Fact]
    public void ValidateBook_ShouldThrow_WhenAuthorIsEmpty()
    {
        var book = CreateValidBook();
        book.Author = "";

        Assert.Throws<ArgumentException>(() =>
            BookValidator.ValidateBook(book, new List<int> { 1 }));
    }

    [Fact]
    public void ValidateBook_ShouldThrow_WhenTitleTooLong()
    {
        var book = CreateValidBook();
        book.Title = new string('A', 201);

        Assert.Throws<ArgumentException>(() =>
            BookValidator.ValidateBook(book, new List<int> { 1 }));
    }

    [Fact]
    public void ValidateBook_ShouldThrow_WhenAuthorTooLong()
    {
        var book = CreateValidBook();
        book.Author = new string('A', 101);

        Assert.Throws<ArgumentException>(() =>
            BookValidator.ValidateBook(book, new List<int> { 1 }));
    }

    [Fact]
    public void ValidateBook_ShouldThrow_WhenDescriptionIsEmpty()
    {
        var book = CreateValidBook();
        book.Description = "";

        Assert.Throws<ArgumentException>(() =>
            BookValidator.ValidateBook(book, new List<int> { 1 }));
    }

    [Fact]
    public void ValidateBook_ShouldThrow_WhenDescriptionTooShort()
    {
        var book = CreateValidBook();
        book.Description = "Too short";

        Assert.Throws<ArgumentException>(() =>
            BookValidator.ValidateBook(book, new List<int> { 1 }));
    }

    [Fact]
    public void ValidateBook_ShouldThrow_WhenNoGenresSelected()
    {
        var book = CreateValidBook();

        Assert.Throws<ArgumentException>(() =>
            BookValidator.ValidateBook(book, new List<int>()));
    }

    [Fact]
    public void ValidateBook_ShouldNotThrow_WhenBookIsValid()
    {
        var book = CreateValidBook();

        var exception = Record.Exception(() =>
            BookValidator.ValidateBook(book, new List<int> { 1 }));

        Assert.Null(exception);
    }
}

