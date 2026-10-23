using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Services.Validations
{
    public class ValidateUser
    {
        public static void ValidateUserData(string userName, string email, string password)
        {
            if (string.IsNullOrWhiteSpace(userName))
                throw new ArgumentException("Username is required.");
            if (userName.Length < 4)
                throw new ArgumentException("Username must be at least 4 characters long.");
            if (userName.Length > 15)
                throw new ArgumentException("Username cannot exceed 15 characters.");
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email is required.");
            if (!email.Contains("@") || !email.Contains("."))
                throw new ArgumentException("Email is not valid.");
            if (email.Length > 100)
                throw new ArgumentException("Email cannot exceed 100 characters.");
            if (string.IsNullOrWhiteSpace(password))
                throw new ArgumentException("Password is required.");
            if (password.Length < 6)
                throw new ArgumentException("Password must be at least 6 characters long.");
            if (password.Length > 35)
                throw new ArgumentException("Password cannot exceed 35 characters.");
        }
    }
}
