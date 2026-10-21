import { useState } from "react";
import Modal from "./Modal";

const emptyBook = { title: "", author: "", description: "", genreIds: [] };

export default function BookFormModal({ book, labels, onSave, onClose }) {
  const isEditing = Boolean(book);
  const [form, setForm] = useState(() =>
    book
      ? {
          title: book.title,
          author: book.author,
          description: book.description,
          genreIds: book.bookGenres?.map((bg) => bg.genreId) ?? [],
        }
      : emptyBook
  );
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function toggleLabel(id) {
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
          <legend className="label">Labels</legend>
          {labels.length === 0 ? (
            <p className="text-sm text-ink-500">No labels yet. Create some in the Labels tab first.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {labels.map((label) => {
                const selected = form.genreIds.includes(label.id);
                return (
                  <button
                    key={label.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleLabel(label.id)}
                    className={`chip transition ${
                      selected
                        ? "border-pine-500 bg-pine-600 text-white"
                        : "border-frost-300 bg-white text-ink-700 hover:border-pine-500"
                    }`}
                  >
                    {selected && <span aria-hidden>✓</span>}
                    {label.name}
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
