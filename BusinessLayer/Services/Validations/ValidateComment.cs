using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Services.Validations
{
    public static class CommentValidator
    {
        public static void ValidateComment(Comment comment)
        {
            if (string.IsNullOrWhiteSpace(comment.Content))
                throw new ArgumentException("Comment cannot be empty.");

            if (comment.Content.Length < 5)
                throw new ArgumentException("Comment must be at least 5 characters.");

            if (comment.Content.Length > 1000)
                throw new ArgumentException("Comment cannot exceed 1000 characters.");
        }
    }
}
