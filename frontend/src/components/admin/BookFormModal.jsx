import { useEffect, useMemo, useState } from "react";
import Modal from "./Modal";
import BookCover from "../BookCover";

const MAX_COVER_MB = 5;

const emptyBook = { title: "", author: "", description: "", genreIds: [], coverFile: null };

export default function BookFormModal({ book, genres, onSave, onClose }) {
  const isEditing = Boolean(book);
  const [form, setForm] = useState(() =>
    book
      ? {
          title: book.title,
          author: book.author,
          description: book.description,
          genreIds: book.bookGenres?.map((bg) => bg.genreId) ?? [],
          coverFile: null,
        }
      : emptyBook
  );
  const [saving, setSaving] = useState(false);
  const [coverError, setCoverError] = useState("");

  // Local preview for a newly picked cover; revoked when it changes or the modal closes.
  const previewUrl = useMemo(() => (form.coverFile ? URL.createObjectURL(form.coverFile) : null), [form.coverFile]);
  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

  function handleCoverChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setCoverError("Please choose an image file (JPG, PNG, WebP…).");
      return;
    }
    if (file.size > MAX_COVER_MB * 1024 * 1024) {
      setCoverError(`That image is over ${MAX_COVER_MB} MB. Try a smaller one.`);
      return;
    }
    setCoverError("");
    setForm((prev) => ({ ...prev, coverFile: file }));
  }

  function clearCover() {
    setForm((prev) => ({ ...prev, coverFile: null }));
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function toggleGenre(id) {
    setForm((prev) => ({
      ...prev,
      genreIds: prev.genreIds.includes(id) ? prev.genreIds.filter((x) => x !== id) : [...prev.genreIds, id],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      title={isEditing ? "Edit book" : "Shelve a new book"}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn-ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" form="book-form" className="btn-primary" disabled={saving}>
            {saving ? "Saving…" : isEditing ? "Save changes" : "Add book"}
          </button>
        </>
      }
    >
      <form id="book-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4">
          <BookCover
            book={{ title: form.title, imagePath: book?.imagePath }}
            src={form.coverFile ? previewUrl : undefined}
            className="h-28 w-20 shrink-0 rounded-lg text-2xl shadow-cozy"
          />
          <div className="min-w-0 space-y-2">
            <span className="label mb-0">Cover image</span>
            <div className="flex flex-wrap gap-2">
              <label className="btn-ghost cursor-pointer border border-frost-300 bg-white px-3 py-1.5">
                {form.coverFile || book?.imagePath ? "Replace cover" : "Upload cover"}
                <input type="file" accept="image/*" onChange={handleCoverChange} className="sr-only" />
              </label>
              {form.coverFile && (
                <button type="button" className="btn-ghost px-3 py-1.5" onClick={clearCover}>
                  Undo
                </button>
              )}
            </div>
            {coverError ? (
              <p className="text-xs font-semibold text-berry-600">{coverError}</p>
            ) : (
              <p className="truncate text-xs text-ink-400">
                {form.coverFile ? form.coverFile.name : `JPG, PNG or WebP, up to ${MAX_COVER_MB} MB.`}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="title" className="label">
            Title
          </label>
          <input id="title" name="title" value={form.title} onChange={handleChange} className="input" required autoFocus />
        </div>

        <div>
          <label htmlFor="author" className="label">
            Author
          </label>
          <input id="author" name="author" value={form.author} onChange={handleChange} className="input" required />
        </div>

        <div>
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="input resize-y"
            required
          />
        </div>

        <fieldset>
          <legend className="label">Genres</legend>
          {genres.length === 0 ? (
            <p className="text-sm text-ink-500">No genres yet. Create some in the Genres tab first.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => {
                const selected = form.genreIds.includes(genre.id);
                return (
                  <button
                    key={genre.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleGenre(genre.id)}
                    className={`chip transition ${
                      selected
                        ? "border-pine-500 bg-pine-600 text-white"
                        : "border-frost-300 bg-white text-ink-700 hover:border-pine-500"
                    }`}
                  >
                    {selected && <span aria-hidden>✓</span>}
                    {genre.name}
                  </button>
                );
              })}
            </div>
          )}
        </fieldset>
      </form>
    </Modal>
  );
}
