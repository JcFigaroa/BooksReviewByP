import { useEffect, useState } from "react";
import api from "../api/axios";
import BookCover from "../components/BookCover";

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
        <p className="text-xl text-ink-500">Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-berry-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-frost-100 via-frost-50 to-ember-50/60 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl mb-6 text-ink-900">Books</h1>

        {books.length === 0 ? (
          <p className="text-ink-500">No books found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <div key={book.id} className="card flex flex-col overflow-hidden transition hover:-translate-y-0.5">
                <BookCover book={book} className="aspect-[2/3] w-full text-6xl" />

                <div className="flex flex-1 flex-col p-4">
                  <h2 className="text-xl text-ink-900">{book.title}</h2>

                  <p className="text-ink-500 mt-1">{book.author}</p>

                  <p className="text-sm text-ink-700 mt-3 line-clamp-3">{book.description}</p>

                  {book.bookGenres?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {book.bookGenres.map((bg) => (
                        <span key={bg.genreId} className="chip border-ember-100 bg-ember-50 text-ember-700">
                          {bg.genre?.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-ink-400 mt-3">
                    Added on {new Date(book.createdAt).toLocaleDateString()}
                  </p>

                  <div className="mt-auto pt-4">
                    <button className="btn-primary w-full">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
