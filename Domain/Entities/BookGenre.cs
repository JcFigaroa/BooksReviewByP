using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;
using System.Text.Json.Serialization;

namespace Domain.Entities
{
    public class BookGenre
    {
        public int BookId { get; set; }
        public int GenreId { get; set; }

        // Navigation
        [JsonIgnore]
        public Book Book { get; set; }
        public Genre Genre { get; set; }
    }
}
