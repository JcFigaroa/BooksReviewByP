using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class CommentDto
    {
        public string Content { get; set; }
        public int BookId { get; set; }
        public int UserId { get; set; }
    }
}
