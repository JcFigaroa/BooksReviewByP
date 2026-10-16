using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.Entities
{
    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign Keys
        public int BookId { get; set; }
        public int UserId { get; set; }

        // Navigation
        public Book Book { get; set; }
        public User User { get; set; }
    }
}
