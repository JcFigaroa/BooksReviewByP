using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; } 

        public bool IsAdmin { get; set; } = false;

        [JsonIgnore]
        public List<Book> Books { get; set; }

        [JsonIgnore]
        public List<Comment> Comments { get; set; }
    }
}