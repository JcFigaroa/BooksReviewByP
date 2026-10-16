using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Interfaces
{
    public interface IGenreService
    {
        Task<Genre?> GetByIdAsync(int id);
        Task<List<Genre>> GetAllAsync();
        Task<Genre> CreateAsync(Genre genre);
        Task<Genre?> UpdateAsync(Genre genre);
        Task<bool> DeleteAsync(int id);
    }
}
