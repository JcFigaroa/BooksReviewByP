import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await api.get("/books"); // matches BooksController
        setBooks(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load books");
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Books</h1>

      {books.length === 0 ? (
        <p className="text-gray-600">No books found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {book.title}
              </h2>

              <p className="text-gray-600 mt-1">{book.author}</p>

              <p className="text-sm text-gray-500 mt-4 line-clamp-3">
                {book.description}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Genre: {book.bookGenres?.map(bg => bg.genre.name).join(", ") || "None"}
                </p>


              <p className="text-xs text-gray-400 mt-2">
                Added on {new Date(book.createdAt).toLocaleDateString()}
              </p>

              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
