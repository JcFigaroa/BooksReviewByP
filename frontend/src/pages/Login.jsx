import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

export default function Login() {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/login", { email, password });
      const token = response.data.token;

      login(token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("TOKEN PAYLOAD:", payload);
      const isAdmin = payload.isAdmin === "True";

      window.location.href = isAdmin ? "/admin" : "/books";
    } catch {
      setError("Invalid email or password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-frost-100 via-frost-50 to-ember-50/60 px-4">
      <div className="card w-full max-w-md p-8">
        <h2 className="text-3xl text-center mb-6 text-ink-900">
          Welcome Back
        </h2>

        {error && (
          <p className="text-berry-600 text-center mb-4 font-medium">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
