import { useState } from "react";
import { coverUrl } from "../api/books";

// Shows a book's cover image, falling back to a pine "spine" with the title's initial.
export default function BookCover({ book, src, className = "" }) {
  const url = src ?? coverUrl(book.imagePath);
  const [failedUrl, setFailedUrl] = useState(null);

  if (url && failedUrl !== url) {
    return (
      <img
        src={url}
        alt={`Cover of ${book.title}`}
        loading="lazy"
        onError={() => setFailedUrl(url)}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={`flex items-center justify-center bg-gradient-to-br from-pine-500 to-pine-700 font-serif text-frost-50 ${className}`}
    >
      {book.title?.charAt(0).toUpperCase() || "📖"}
    </div>
  );
}
