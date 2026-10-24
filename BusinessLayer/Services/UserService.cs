using DataLayer.Interfaces;
using Domain.Entities;
using BusinessLayer.Interfaces;
using BusinessLayer.Services.Validations;
using BCrypt.Net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;

        public UserService(IUserRepository repo)
        {
            _repo = repo;
        }

        public Task<User?> GetByIdAsync(int id) => _repo.GetByIdAsync(id);

        public Task<List<User>> GetAllAsync() => _repo.GetAllAsync();

        public async Task<User> CreateAsync(User user)
        {
            user.IsAdmin = false; // Ensure that new users are not admins by default

            ValidateUser.ValidateUserData(user.UserName, user.Email, user.Password);

            var existingUser = await _repo.GetByUsernameAsync(user.UserName);
            if (existingUser != null)
            {
                throw new ArgumentException("Username already exists.");
            }

            var existingEmail = await _repo.GetByEmailAsync(user.Email);
            if (existingEmail != null)
            {
                throw new ArgumentException("Email already exists.");
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);


            await _repo.AddAsync(user);
            return user;
        }

        public async Task<User?> UpdateAsync(User user)
        {

            var existingUser = await _repo.GetByUsernameAsync(user.UserName);
            if (existingUser != null && existingUser.Id != user.Id)
            {
                throw new ArgumentException("Username already exists.");
            }

            var existing = await _repo.GetByIdAsync(user.Id);
            if (existing == null) return null;

            existing.UserName = user.UserName;
            existing.Email = user.Email;
            existing.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            await _repo.UpdateAsync(existing);
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            if (id <= 0) throw new ArgumentException("Invalid user ID.");

            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return false;

            await _repo.DeleteAsync(id);
            return true;
        }
    }
}
