import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { COMMENT_MAX, COMMENT_MIN, createComment, deleteComment, getComments } from "../../api/comments";
import { errorMessage } from "../../api/errors";
import { parseApiDate, timeAgo, formatDate } from "../../utils/dates";
import ConfirmDialog from "../admin/ConfirmDialog";

const newestFirst = (a, b) => (parseApiDate(b.createdAt)?.getTime() ?? 0) - (parseApiDate(a.createdAt)?.getTime() ?? 0);

export default function Comments({ bookId }) {
  const { isAuthenticated, isAdmin, userId } = useContext(AuthContext);
  const location = useLocation();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError("");

    getComments(bookId)
      .then((data) => !cancelled && setComments([...data].sort(newestFirst)))
      .catch((err) => !cancelled && setLoadError(errorMessage(err, "Failed to load comments")))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [bookId]);

  const trimmed = content.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < COMMENT_MIN;
  const canPost = trimmed.length >= COMMENT_MIN && trimmed.length <= COMMENT_MAX && !posting;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canPost) return;

    setPosting(true);
    setPostError("");
    try {
      const saved = await createComment({ content: trimmed, bookId, userId });
      setComments((prev) => [saved, ...prev]);
      setContent("");
    } catch (err) {
      setPostError(errorMessage(err, "Failed to post your comment"));
    } finally {
      setPosting(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setPostError(errorMessage(err, "Failed to delete the comment"));
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <section aria-labelledby="comments-heading" className="space-y-5">
      <div className="flex items-baseline gap-3">
        <h2 id="comments-heading" className="text-3xl text-ink-900">
          Comments
        </h2>
        {!loading && !loadError && <span className="text-ink-400">{comments.length}</span>}
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="card p-4 sm:p-5">
          <label htmlFor="comment" className="label">
            Share your thoughts
          </label>
          <textarea
            id="comment"
            rows={4}
            maxLength={COMMENT_MAX}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What did you think of this book?"
            className="input resize-y"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className={`text-xs ${tooShort ? "text-berry-600" : "text-ink-400"}`}>
              {tooShort ? `At least ${COMMENT_MIN} characters` : `${trimmed.length} / ${COMMENT_MAX}`}
            </p>
            <button type="submit" className="btn-primary" disabled={!canPost}>
              {posting ? "Posting..." : "Post comment"}
            </button>
          </div>

          {postError && <p className="mt-3 text-sm font-medium text-berry-600">{postError}</p>}
        </form>
      ) : (
        <div className="card flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
          <p className="text-ink-700">Log in to join the conversation.</p>
          <Link to={`/login?redirect=${encodeURIComponent(location.pathname)}`} className="btn-primary">
            Log in to comment
          </Link>
        </div>
      )}

      {loading ? (
        <p className="py-6 text-center text-ink-500">Loading comments...</p>
      ) : loadError ? (
        <p className="py-6 text-center text-berry-600">{loadError}</p>
      ) : comments.length === 0 ? (
        <p className="py-6 text-center text-ink-500">No comments yet. Be the first to share what you think.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              canDelete={isAdmin}
              onDelete={() => setPendingDelete(comment)}
            />
          ))}
        </ul>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete this comment?"
          message="It will be removed from this book for everyone. This can't be undone."
          onConfirm={() => handleDelete(pendingDelete.id)}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </section>
  );
}

function CommentItem({ comment, canDelete, onDelete }) {
  // The API doesn't send the author's name yet; use it as soon as it does
  const author = comment.userName || comment.user?.userName || "Reader";

  return (
    <li className="card animate-fade-up p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pine-50 font-serif text-lg text-pine-600"
        >
          {author.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <p className="font-semibold text-ink-900">{author}</p>
            <time dateTime={comment.createdAt} title={formatDate(comment.createdAt)} className="text-xs text-ink-400">
              {timeAgo(comment.createdAt)}
            </time>
          </div>
          <p className="mt-1 whitespace-pre-line break-words text-ink-700">{comment.content}</p>

          {canDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="mt-2 text-xs font-semibold text-ink-400 transition hover:text-berry-600"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
