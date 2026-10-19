using Domain.DTOs;
using Domain.Entities;
using AutoMapper;

namespace BooksReviewByPamela.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UserDto, User>();
            CreateMap<BookDto, Book>();
            CreateMap<GenreDto, Genre>();
            CreateMap<CommentDto, Comment>();
            CreateMap<UserCreateDto, User>();

        }
    }
}
