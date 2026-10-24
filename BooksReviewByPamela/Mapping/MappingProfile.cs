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
            CreateMap<BookDto, Book>()
                .ForMember(b => b.BookGenres, opt => opt.Ignore());
            CreateMap<GenreDto, Genre>(); 
            CreateMap<CommentDto, Comment>();
            CreateMap<UserCreateDto, User>();
            CreateMap<Comment, CommentResponseDto>()
                .ForMember(dest => dest.UserName,opt => opt.MapFrom(src => src.User.UserName));
        }
    }
}
