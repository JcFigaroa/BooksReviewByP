using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Interfaces
{
    public interface IGenreRepository
    {
        Task<Genre?> GetByIdAsync(int id);
        Task<List<Genre>> GetAllAsync();
        Task AddAsync(Genre genre);
        Task UpdateAsync(Genre genre);
        Task DeleteAsync(int id);
        Task<Genre?> GetByNameAsync(string name);
    }
}
