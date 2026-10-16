using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Domain.Entities;

namespace Domain.Entities
{
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign Keys
        public int UserId { get; set; }

        // Navigation
        public User User { get; set; }
        public List<BookGenre> BookGenres { get; set; } = new();
        public List<Comment> Comments { get; set; } = new();
    }
}
