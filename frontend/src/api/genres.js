import api from "./axios";

// Matches GenresController: /api/genres, body = GenreDto { name }.
export const getGenres = () => api.get("/genres").then((res) => res.data);

export const createGenre = (name) => api.post("/genres", { name: name.trim() }).then((res) => res.data);

export const updateGenre = (id, name) => api.put(`/genres/${id}`, { name: name.trim() }).then((res) => res.data);

export const deleteGenre = (id) => api.delete(`/genres/${id}`);
