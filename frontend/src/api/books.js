import api from "./axios";

// Matches BooksController: /api/books, body = BookDto { title, author, description, userId, genreIds }
export const getBooks = () => api.get("/books").then((res) => res.data);

export const createBook = (book) => api.post("/books", toBookDto(book)).then((res) => res.data);

export const updateBook = (id, book) => api.put(`/books/${id}`, toBookDto(book)).then((res) => res.data);

export const deleteBook = (id) => api.delete(`/books/${id}`);

function toBookDto(book) {
  return {
    title: book.title.trim(),
    author: book.author.trim(),
    description: book.description.trim(),
    genreIds: book.genreIds,
  };
}

// BooksController.UploadImage: multipart form with a single "file" field, returns { imagePath }
export const uploadBookCover = (id, file) => {
  const data = new FormData();
  data.append("file", file);
  return api.post(`/books/${id}/image`, data).then((res) => res.data);
};

// imagePath is served by the API's static files (e.g. "/images/books/abc.jpg"), not under /api
export const coverUrl = (imagePath) => (imagePath ? new URL(imagePath, api.defaults.baseURL).href : null);
