import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [genres, setGenres] = useState([]);


  const [form, setForm] = useState({
    id: null,
    title: "",
    author: "",
    description: "",
    genreIds: []
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    try {
      const response = await api.get("/books");
      setBooks(response.data);
    } catch {
      setError("Failed to load books");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  loadBooks();
  loadGenres();
}, []);

    async function loadGenres() {
    try {
        const response = await api.get("/genres");
        setGenres(response.data);
    } catch {
        alert("Failed to load genres");
    }
    }


  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleCreate(e) {
    e.preventDefault();

    try {
      await api.post("/books", {
        title: form.title,
        author: form.author,
        description: form.description,
        genreIds: form.genreIds
      });

      resetForm();
      loadBooks();
    } catch {
      alert("Failed to create book");
    }
  }

  function startEdit(book) {
    setIsEditing(true);
    setForm({
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      genreIds: book.bookGenres.map(bg => bg.genreId)
    });
  }

  async function handleUpdate(e) {
    e.preventDefault();

    try {
      await api.put(`/books/${form.id}`, {
        title: form.title,
        author: form.author,
        description: form.description,
        genreIds: form.genreIds
      });

      resetForm();
      loadBooks();
    } catch {
      alert("Failed to update book");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this book?")) return;

    try {
      await api.delete(`/books/${id}`);
      loadBooks();
    } catch {
      alert("Failed to delete book");
    }
  }

  function toggleGenre(id) {
  setForm((prev) => {
    const exists = prev.genreIds.includes(id);
    return {
      ...prev,
      genreIds: exists
        ? prev.genreIds.filter((x) => x !== id)
        : [...prev.genreIds, id]
    };
  });
}


  function resetForm() {
    setIsEditing(false);
    setForm({
      id: null,
      title: "",
      author: "",
      description: "",
      genreIds: []
    });
  }

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* FORM */}
      <div className="bg-white shadow-md p-6 rounded-lg mb-10 max-w-xl">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Edit Book" : "Add New Book"}
        </h2>

        <form onSubmit={isEditing ? handleUpdate : handleCreate} className="space-y-4">
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />

          <input
            name="author"
            placeholder="Author"
            value={form.author}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          />

         <div>
            <label className="block mb-2 font-medium">Genres</label>

            <div className="grid grid-cols-2 gap-2">
                {genres.map((g) => (
                <label key={g.id} className="flex items-center space-x-2">
                    <input
                    type="checkbox"
                    checked={form.genreIds.includes(g.id)}
                    onChange={() => toggleGenre(g.id)}
                    />
                    <span>{g.name}</span>
                </label>
                ))}
            </div>
         </div>
        




          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {isEditing ? "Update Book" : "Create Book"}
          </button>
        </form>
      </div>

      {/* BOOK LIST */}
      <h2 className="text-2xl font-semibold mb-4">Books</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {books.map((book) => (
          <div key={book.id} className="bg-white shadow-md p-4 rounded-lg">
            <h3 className="text-xl font-bold">{book.title}</h3>
            <p className="text-gray-600">{book.author}</p>
            <p className="text-sm text-gray-500 mt-2">{book.description}</p>

            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => startEdit(book)}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(book.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
