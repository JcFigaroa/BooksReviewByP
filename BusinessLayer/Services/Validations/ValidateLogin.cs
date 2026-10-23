using Domain.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Services.Validations
{
    public static class LoginValidator
    {
        public static void Validate(LoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email))
                throw new ArgumentException("Email is required.");

            if (string.IsNullOrWhiteSpace(dto.Password))
                throw new ArgumentException("Password is required.");

            if (!dto.Email.Contains("@"))
                throw new ArgumentException("Invalid email address.");
        }
    }
}
