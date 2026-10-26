import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBook } from "../api/books";
import BookCover from "../components/BookCover";
import Comments from "../components/book/Comments";
import { formatDate } from "../utils/dates";

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | notfound | error

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    // Cards are clicked from far down the home page; start the book page at the top
    window.scrollTo(0, 0);

    getBook(id)
      .then((data) => {
        if (cancelled) return;
        setBook(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setStatus(err?.response?.status === 404 ? "notfound" : "error");
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (book?.title) document.title = `${book.title} · Readings Pattern`;
  }, [book?.title]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-frost-100 via-frost-50 to-ember-50/60 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <Link to="/books" className="btn-ghost -ml-2 mb-4 px-2 text-ink-500">
          <span aria-hidden>←</span> Back to all books
        </Link>

        {status === "loading" && <DetailsSkeleton />}

        {status === "notfound" && (
          <Message title="We couldn't find that book">
            It may have been removed. Head back to the shelf to pick another one.
          </Message>
        )}

        {status === "error" && (
          <Message title="Failed to load this book">Please check that the API is running and try again.</Message>
        )}

        {status === "ready" && book && (
          <div className="animate-fade-up space-y-10">
            <article className="card grid gap-6 p-5 sm:p-8 md:grid-cols-[minmax(0,18rem)_1fr] md:gap-10">
              <div className="mx-auto w-full max-w-[16rem] md:max-w-none">
                <BookCover book={book} className="aspect-[2/3] w-full rounded-xl text-7xl shadow-cozy" />
              </div>

              <div className="min-w-0">
                <h1 className="text-3xl leading-tight text-ink-900 sm:text-4xl">{book.title}</h1>
                <p className="mt-2 text-lg text-ink-500">
                  by <span className="font-semibold text-ink-700">{book.author}</span>
                </p>

                {book.bookGenres?.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Labels">
                    {book.bookGenres.map((bg) => (
                      <li key={bg.genreId} className="chip border-ember-100 bg-ember-50 text-ember-700">
                        {bg.genre?.name}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="my-6 h-px bg-frost-200" />

                <h2 className="font-script text-4xl font-normal leading-tight text-berry-600">Review</h2>
                <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-ink-700 sm:text-lg">
                  {book.description || "No description yet."}
                </p>

                {book.createdAt && (
                  <p className="mt-6 text-sm text-ink-400">Added on {formatDate(book.createdAt)}</p>
                )}
              </div>
            </article>

            <Comments bookId={book.id} />
          </div>
        )}
      </div>
    </div>
  );
}

function Message({ title, children }) {
  return (
    <div className="card p-8 text-center sm:p-12">
      <h1 className="text-2xl text-ink-900">{title}</h1>
      <p className="mx-auto mt-2 max-w-md text-ink-500">{children}</p>
      <Link to="/books" className="btn-accent mt-6">
        Browse books
      </Link>
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="card grid animate-pulse gap-6 p-5 sm:p-8 md:grid-cols-[minmax(0,18rem)_1fr] md:gap-10" aria-label="Loading book">
      <div className="mx-auto aspect-[2/3] w-full max-w-[16rem] rounded-xl bg-frost-200 md:max-w-none" />
      <div className="space-y-4">
        <div className="h-9 w-3/4 rounded-lg bg-frost-200" />
        <div className="h-5 w-1/3 rounded-lg bg-frost-200" />
        <div className="h-px bg-frost-200" />
        <div className="space-y-2">
          {[100, 95, 98, 80].map((w) => (
            <div key={w} className="h-4 rounded bg-frost-200" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
