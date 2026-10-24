import { useMemo, useState } from "react";
import BookFormModal from "./BookFormModal";
import ConfirmDialog from "./ConfirmDialog";
import BookCover from "../BookCover";

export default function BooksPanel({ books, genres, onCreate, onUpdate, onDelete }) {
  const [query, setQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [editing, setEditing] = useState(null); // null = closed, "new" = create, book = edit
  const [deleting, setDeleting] = useState(null);

  const visibleBooks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((book) => {
      const matchesQuery = !q || book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q);
      const matchesGenre = !genreFilter || book.bookGenres?.some((bg) => bg.genreId === Number(genreFilter));
      return matchesQuery && matchesGenre;
    });
  }, [books, query, genreFilter]);

  async function handleSave(form) {
    const ok = editing === "new" ? await onCreate(form) : await onUpdate(editing.id, form);
    if (ok) setEditing(null);
  }

  async function handleDelete() {
    if (await onDelete(deleting.id)) setDeleting(null);
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Search by title or author…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input sm:max-w-xs"
          aria-label="Search books"
        />
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="input sm:max-w-[12rem]"
          aria-label="Filter by genre"
        >
          <option value="">All genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        <button className="btn-primary sm:ml-auto" onClick={() => setEditing("new")}>
          <span aria-hidden>＋</span> New book
        </button>
      </div>

      {visibleBooks.length === 0 ? (
        <EmptyState hasBooks={books.length > 0} onAdd={() => setEditing("new")} />
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleBooks.map((book) => (
            <li key={book.id} className="card flex animate-fade-up flex-col p-5">
              <div className="flex items-start gap-4">
                <BookCover book={book} className="h-20 w-14 shrink-0 rounded-lg text-xl shadow-cozy" />
                <div className="min-w-0">
                  <h3 className="truncate text-lg text-ink-900">{book.title}</h3>
                  <p className="text-sm text-ink-500">by {book.author}</p>
                </div>
              </div>

              <p className="mt-3 line-clamp-3 text-sm text-ink-700">{book.description}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {book.bookGenres?.length ? (
                  book.bookGenres.map((bg) => (
                    <span key={bg.genreId} className="chip border-ember-100 bg-ember-50 text-ember-700">
                      {bg.genre?.name ?? genres.find((g) => g.id === bg.genreId)?.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs italic text-ink-400">No genres</span>
                )}
              </div>

              <div className="mt-auto flex items-center justify-between pt-4">
                <span className="text-xs text-ink-400">
                  Added {new Date(book.createdAt).toLocaleDateString()}
                </span>
                <div className="flex gap-1">
                  <button className="btn-ghost px-3 py-1.5" onClick={() => setEditing(book)}>
                    Edit
                  </button>
                  <button
                    className="btn-ghost px-3 py-1.5 text-berry-600 hover:bg-berry-50"
                    onClick={() => setDeleting(book)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <BookFormModal
          book={editing === "new" ? null : editing}
          genres={genres}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete this book?"
          message={`“${deleting.title}” and its comments will be removed for good.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </section>
  );
}

function EmptyState({ hasBooks, onAdd }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <span aria-hidden className="text-4xl">📚</span>
      <h3 className="mt-3 text-xl text-ink-900">{hasBooks ? "No books match" : "The shelves are quiet"}</h3>
      <p className="mt-1 max-w-sm text-sm text-ink-500">
        {hasBooks
          ? "Try a different search or genre filter."
          : "Pour something warm and add the first book to the collection."}
      </p>
      {!hasBooks && (
        <button className="btn-primary mt-5" onClick={onAdd}>
          Add a book
        </button>
      )}
    </div>
  );
}
