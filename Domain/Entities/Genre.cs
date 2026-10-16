using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.Entities
{
    public class Genre
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        // Navigation
        public List<BookGenre> BookGenres { get; set; } = new();
    }
}
