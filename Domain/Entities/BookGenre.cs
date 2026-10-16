using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.Entities
{
    public class BookGenre
    {
        public int BookId { get; set; }
        public int GenreId { get; set; }

        // Navigation
        public Book Book { get; set; }
        public Genre Genre { get; set; }
    }
}
