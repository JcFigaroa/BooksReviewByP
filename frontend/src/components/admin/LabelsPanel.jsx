import { useMemo, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

export default function LabelsPanel({ labels, books, onCreate, onUpdate, onDelete }) {
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [deleting, setDeleting] = useState(null);

  // How many books use each label, so deletes can warn about it.
  const usage = useMemo(() => {
    const counts = {};
    books.forEach((book) => book.bookGenres?.forEach((bg) => (counts[bg.genreId] = (counts[bg.genreId] ?? 0) + 1)));
    return counts;
  }, [books]);

  const sortedLabels = useMemo(() => [...labels].sort((a, b) => a.name.localeCompare(b.name)), [labels]);

  const isDuplicate = (name, ignoreId) =>
    labels.some((l) => l.id !== ignoreId && l.name.trim().toLowerCase() === name.trim().toLowerCase());

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim() || isDuplicate(newName)) return;
    setCreating(true);
    if (await onCreate(newName)) setNewName("");
    setCreating(false);
  }

  function startEdit(label) {
    setEditingId(label.id);
    setEditName(label.name);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!editName.trim() || isDuplicate(editName, editingId)) return;
    if (await onUpdate(editingId, editName)) setEditingId(null);
  }

  async function handleDelete() {
    if (await onDelete(deleting.id)) setDeleting(null);
  }

  const deletingCount = deleting ? usage[deleting.id] ?? 0 : 0;

  return (
    <section className="space-y-5">
      <form onSubmit={handleCreate} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="new-label" className="label">
            New label
          </label>
          <input
            id="new-label"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Fireside mysteries"
            className="input"
          />
          {newName && isDuplicate(newName) && (
            <p className="mt-1.5 text-xs font-semibold text-berry-600">That label already exists.</p>
          )}
        </div>
        <button type="submit" className="btn-primary" disabled={creating || !newName.trim() || isDuplicate(newName)}>
          {creating ? "Adding…" : "Add label"}
        </button>
      </form>

      {sortedLabels.length === 0 ? (
        <div className="card px-6 py-14 text-center">
          <span aria-hidden className="text-4xl">🏷️</span>
          <h3 className="mt-3 text-xl text-ink-900">No labels yet</h3>
          <p className="mt-1 text-sm text-ink-500">Labels help readers find books by mood and genre.</p>
        </div>
      ) : (
        <ul className="card divide-y divide-frost-200 overflow-hidden">
          {sortedLabels.map((label) => (
            <li key={label.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
              {editingId === label.id ? (
                <form onSubmit={handleUpdate} className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="input flex-1"
                    aria-label="Label name"
                    autoFocus
                    onKeyDown={(e) => e.key === "Escape" && setEditingId(null)}
                  />
                  <div className="flex gap-1">
                    <button
                      type="submit"
                      className="btn-primary px-3 py-2"
                      disabled={!editName.trim() || isDuplicate(editName, label.id)}
                    >
                      Save
                    </button>
                    <button type="button" className="btn-ghost px-3 py-2" onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <span className="chip border-ember-100 bg-ember-50 text-sm text-ember-700">{label.name}</span>
                  <span className="text-xs text-ink-400">
                    {usage[label.id] ?? 0} {usage[label.id] === 1 ? "book" : "books"}
                  </span>
                  <div className="ml-auto flex gap-1">
                    <button className="btn-ghost px-3 py-1.5" onClick={() => startEdit(label)}>
                      Rename
                    </button>
                    <button
                      className="btn-ghost px-3 py-1.5 text-berry-600 hover:bg-berry-50"
                      onClick={() => setDeleting(label)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete this label?"
          message={
            deletingCount
              ? `“${deleting.name}” is on ${deletingCount} ${deletingCount === 1 ? "book" : "books"}. It will be removed from them.`
              : `“${deleting.name}” isn't used by any books yet.`
          }
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </section>
  );
}
