import { useCallback, useEffect, useState } from "react";
import { getBooks, createBook, updateBook, deleteBook, uploadBookCover } from "../api/books";
import { getGenres, createGenre, updateGenre, deleteGenre } from "../api/genres";
import { errorMessage } from "../api/errors";
import BooksPanel from "../components/admin/BooksPanel";
import LabelsPanel from "../components/admin/LabelsPanel";
import Toasts from "../components/admin/Toasts";
import Snowfall from "../components/admin/Snowfall";

const tabs = [
  { id: "books", label: "Books", icon: "📖" },
  { id: "labels", label: "Labels", icon: "🏷️" },
];

export default function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [tab, setTab] = useState("books");
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((tone, message) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, tone, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);

  const loadAll = useCallback(async () => {
    try {
      const [bookData, labelData] = await Promise.all([getBooks(), getGenres()]);
      setBooks(bookData);
      setLabels(labelData);
      setLoadError("");
    } catch (err) {
      setLoadError(errorMessage(err, "Couldn't load the library"));
      return;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Runs a mutation, refreshes data, and reports the outcome. Returns true on success.
  async function run(action, successMessage, failureMessage) {
    try {
      await action();
      await loadAll();
      notify("success", successMessage);
      return true;
    } catch (err) {
      notify("error", errorMessage(err, failureMessage));
      return false;
    }
  }

  // Saves the book, then uploads the cover if one was picked. A failed cover upload
  // still keeps the saved book, so the modal closes and the error says what happened.
  async function saveBook(save, form, successMessage, failureMessage) {
    let bookId;
    try {
      bookId = (await save()).id;
    } catch (err) {
      notify("error", errorMessage(err, failureMessage));
      return false;
    }

    let coverFailed = false;
    if (form.coverFile) {
      try {
        await uploadBookCover(bookId, form.coverFile);
      } catch (err) {
        coverFailed = true;
        notify("error", errorMessage(err, "The book was saved, but the cover couldn't be uploaded"));
      }
    }

    await loadAll();
    if (!coverFailed) notify("success", successMessage);
    return true;
  }

  const bookHandlers = {
    onCreate: (form) =>
      saveBook(() => createBook(form), form, `“${form.title}” is on the shelf.`, "Couldn't add the book"),
    onUpdate: (id, form) =>
      saveBook(() => updateBook(id, form).then(() => ({ id })), form, "Book updated.", "Couldn't update the book"),
    onDelete: (id) => run(() => deleteBook(id), "Book deleted.", "Couldn't delete the book"),
  };

  const labelHandlers = {
    onCreate: (name) => run(() => createGenre(name), `Label “${name.trim()}” added.`, "Couldn't add the label"),
    onUpdate: (id, name) => run(() => updateGenre(id, name), "Label renamed.", "Couldn't rename the label"),
    onDelete: (id) => run(() => deleteGenre(id), "Label deleted.", "Couldn't delete the label"),
  };

  const unlabeled = books.filter((b) => !b.bookGenres?.length).length;
  const newest = [...books].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <Snowfall />

      <main className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-pine-600">Admin</p>
          <h1 className="mt-1 text-3xl text-ink-900 sm:text-4xl">The reading room</h1>
          <p className="mt-2 max-w-xl text-ink-500">
            Tend to the collection: shelve new books, tidy up details, and keep labels in order.
          </p>
        </header>

        {loading ? (
          <LoadingState />
        ) : loadError ? (
          <div className="card flex flex-col items-center px-6 py-14 text-center">
            <span aria-hidden className="text-4xl">🌨️</span>
            <h2 className="mt-3 text-xl text-ink-900">Snowed in</h2>
            <p className="mt-1 text-sm text-ink-500">{loadError}</p>
            <button
              className="btn-primary mt-5"
              onClick={() => {
                setLoading(true);
                setLoadError("");
                loadAll();
              }}
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <dl className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Stat label="Books" value={books.length} />
              <Stat label="Labels" value={labels.length} />
              <Stat label="Unlabeled books" value={unlabeled} />
              <Stat label="Newest arrival" value={newest?.title ?? "—"} small />
            </dl>

            <div role="tablist" className="mb-5 inline-flex rounded-2xl border border-frost-200 bg-white/70 p-1 shadow-cozy">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`btn px-5 py-2 ${tab === t.id ? "bg-pine-600 text-white" : "text-ink-700 hover:bg-frost-100"}`}
                >
                  <span aria-hidden>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>

            {tab === "books" ? (
              <BooksPanel books={books} labels={labels} {...bookHandlers} />
            ) : (
              <LabelsPanel labels={labels} books={books} {...labelHandlers} />
            )}
          </>
        )}
      </main>

      <Toasts toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}

function Stat({ label, value, small }) {
  return (
    <div className="card px-5 py-4">
      <dt className="text-xs font-semibold uppercase tracking-wider text-ink-400">{label}</dt>
      <dd className={`mt-1 truncate font-serif text-ink-900 ${small ? "text-lg" : "text-3xl"}`}>{value}</dd>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="card h-48 animate-pulse bg-frost-100/70" />
      ))}
    </div>
  );
}
