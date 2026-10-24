import api from "./axios";

// Matches CommentsController: GET /api/comments/book/{bookId}, POST /api/comments, DELETE /api/comments/{id}.
// GET and POST return CommentResponseDto { id, content, userId, userName, createdAt }, GET newest first.
// POST needs a login: the API takes the author from the token, so the body is just { content, bookId }.
// DELETE needs a login and is allowed for the comment's author or an admin (403 otherwise).
export const getComments = (bookId) => api.get(`/comments/book/${bookId}`).then((res) => res.data);

export const createComment = ({ content, bookId }) =>
  api.post("/comments", { content: content.trim(), bookId }).then((res) => res.data);

export const deleteComment = (id) => api.delete(`/comments/${id}`);

// Same rules as CommentValidator on the API
export const COMMENT_MIN = 5;
export const COMMENT_MAX = 1000;
