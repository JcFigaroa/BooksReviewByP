using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace BusinessLayer.Services.Validations
{
    public static class ValidateGenre
    {
        public static void ValidateGenreData(Genre genre)
        {
            if (string.IsNullOrWhiteSpace(genre.Name))
                throw new ArgumentException("Genre name cannot be empty.");

            if (genre.Name.Length < 2)
                throw new ArgumentException("Genre name must be at least 2 characters.");

            if (genre.Name.Length > 20)
                throw new ArgumentException("Genre name cannot exceed 20 characters.");
        }
    }
}
