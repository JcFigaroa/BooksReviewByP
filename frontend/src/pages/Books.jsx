import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import BookCover from "../components/BookCover";
import Hero from "../components/home/Hero";
import AboutMe from "../components/home/AboutMe";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState(null);

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

  // Only offer genres that at least one book actually has, so every chip returns results
  const genres = useMemo(() => {
    const byId = new Map();
    books.forEach((book) =>
      book.bookGenres?.forEach((bg) => {
        if (bg.genre?.name) byId.set(bg.genreId, bg.genre.name);
      })
    );
    return [...byId].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
  }, [books]);

  const visibleBooks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((book) => {
      const matchesQuery =
        !q || book.title?.toLowerCase().includes(q) || book.author?.toLowerCase().includes(q);
      const matchesGenre = genreFilter === null || book.bookGenres?.some((bg) => bg.genreId === genreFilter);
      return matchesQuery && matchesGenre;
    });
  }, [books, query, genreFilter]);

  const isFiltering = query.trim() !== "" || genreFilter !== null;

  function clearFilters() {
    setQuery("");
    setGenreFilter(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-frost-100 via-frost-50 to-ember-50/60 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-10 sm:space-y-14">
        <Hero />

        <AboutMe />

        <section aria-labelledby="books-heading">
          <h2 id="books-heading" className="mb-6 text-3xl text-ink-900">Books</h2>

          {books.length > 0 && (
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {genres.length > 0 && (
                <div className="order-2 flex flex-wrap gap-2 lg:order-1" role="group" aria-label="Filter by genre">
                  <GenreChip active={genreFilter === null} onClick={() => setGenreFilter(null)}>
                    All genres
                  </GenreChip>
                  {genres.map((genre) => (
                    <GenreChip
                      key={genre.id}
                      active={genreFilter === genre.id}
                      onClick={() => setGenreFilter(genreFilter === genre.id ? null : genre.id)}
                    >
                      {genre.name}
                    </GenreChip>
                  ))}
                </div>
              )}

              <div className="relative order-1 w-full shrink-0 lg:order-2 lg:ml-auto lg:max-w-xs">
                <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <circle cx="9" cy="9" r="6" />
                    <path d="m14 14 4 4" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  type="search"
                  placeholder="Search by title or author…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="input py-2 pl-10"
                  aria-label="Search books by title or author"
                />
              </div>
            </div>
          )}

          {isFiltering && !loading && !error && books.length > 0 && (
            <p className="mb-4 text-sm text-ink-500" aria-live="polite">
              Showing {visibleBooks.length} of {books.length} {books.length === 1 ? "book" : "books"}
              <button onClick={clearFilters} className="ml-2 font-semibold text-pine-600 underline-offset-2 hover:underline">
                Clear filters
              </button>
            </p>
          )}

          {loading ? (
            <p className="py-10 text-center text-xl text-ink-500">Loading books...</p>
          ) : error ? (
            <p className="py-10 text-center text-xl text-berry-600">{error}</p>
          ) : books.length === 0 ? (
            <p className="text-ink-500">No books found.</p>
          ) : visibleBooks.length === 0 ? (
            <div className="card flex flex-col items-center px-6 py-14 text-center">
              <span aria-hidden className="text-4xl">📚</span>
              <h3 className="mt-3 text-xl text-ink-900">No books match</h3>
              <p className="mt-1 max-w-sm text-sm text-ink-500">Try a different title, author or genre.</p>
              <button className="btn-primary mt-5" onClick={clearFilters}>
                Show all books
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {visibleBooks.map((book) => (
                <Link
                  key={book.id}
                  to={`/books/${book.id}`}
                  className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-pine-100"
                >
                  <BookCover book={book} className="aspect-[2/3] w-full text-6xl" />

                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-xl text-ink-900 transition group-hover:text-pine-600">{book.title}</h3>

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
                      <span className="btn-primary w-full">View Details</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function GenreChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`chip px-4 py-1.5 text-sm transition focus:outline-none focus-visible:ring-4 focus-visible:ring-pine-100 ${
        active
          ? "border-pine-600 bg-pine-600 text-frost-50"
          : "border-frost-300 bg-white text-ink-700 hover:border-pine-500 hover:text-pine-600"
      }`}
    >
      {children}
    </button>
  );
}
