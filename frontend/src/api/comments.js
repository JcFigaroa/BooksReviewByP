import api from "./axios";

// Matches CommentsController: GET /api/comments/book/{bookId}, POST /api/comments, DELETE /api/comments/{id}.
// Body = CommentDto { content, bookId, userId }. The API currently ignores userId and saves every comment as user 1.
export const getComments = (bookId) => api.get(`/comments/book/${bookId}`).then((res) => res.data);

export const createComment = ({ content, bookId, userId }) =>
  api.post("/comments", { content: content.trim(), bookId, userId }).then((res) => res.data);

export const deleteComment = (id) => api.delete(`/comments/${id}`);

// Same rules as CommentValidator on the API
export const COMMENT_MIN = 5;
export const COMMENT_MAX = 1000;
