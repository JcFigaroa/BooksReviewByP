import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { registerUser, validateRegistration, registerErrorMessage } from "../api/users";

export default function Register() {
  const { login } = useContext(AuthContext);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Keep the redirect (e.g. a book's comments) when hopping between login and register
  const redirect = new URLSearchParams(window.location.search).get("redirect");
  const safeRedirect = redirect?.startsWith("/") && !redirect.startsWith("//") ? redirect : null;
  const loginLink = safeRedirect ? `/login?redirect=${encodeURIComponent(safeRedirect)}` : "/login";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const problem = validateRegistration({ userName, email, password, confirmPassword });
    if (problem) {
      setError(problem);
      return;
    }

    setSubmitting(true);
    try {
      await registerUser({ userName, email, password });
    } catch (err) {
      setError(registerErrorMessage(err));
      setSubmitting(false);
      return;
    }

    // Account exists now, so sign the new reader in right away
    try {
      const response = await api.post("/login", { email: email.trim(), password });
      login(response.data.token);
      window.location.href = safeRedirect || "/books";
    } catch {
      window.location.href = loginLink;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-frost-100 via-frost-50 to-ember-50/60 px-4">
      <div className="card w-full max-w-md p-8">
        <h2 className="text-3xl text-center mb-6 text-ink-900">
          Create an Account
        </h2>

        {error && (
          <p className="text-berry-600 text-center mb-4 font-medium">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className="label" htmlFor="register-username">
              Username
            </label>
            <input
              id="register-username"
              type="text"
              placeholder="bookworm"
              className="input"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              autoComplete="username"
              maxLength={15}
              required
            />
            <p className="mt-1 text-xs text-ink-400">4 to 15 characters</p>
          </div>

          <div>
            <label className="label" htmlFor="register-email">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              placeholder="you@example.com"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="register-password">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              placeholder="••••••••"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              maxLength={35}
              required
            />
            <p className="mt-1 text-xs text-ink-400">At least 6 characters</p>
          </div>

          <div>
            <label className="label" htmlFor="register-confirm">
              Confirm password
            </label>
            <input
              id="register-confirm"
              type="password"
              placeholder="••••••••"
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              maxLength={35}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3"
            disabled={submitting}
          >
            {submitting ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-700">
          Already have an account?{" "}
          <Link to={loginLink} className="font-semibold text-pine-700 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
