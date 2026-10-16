using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Domain.Entities;

namespace Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        // Navigation
        public List<Book> Books { get; set; } = new();
        public List<Comment> Comments { get; set; } = new();
    }
}
