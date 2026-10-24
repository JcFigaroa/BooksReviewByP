import api from "./axios";

// Matches UsersController: POST /api/users, body = UserCreateDto { userName, email, password, isAdmin }.
export const registerUser = ({ userName, email, password }) =>
  api
    .post("/users", { userName: userName.trim(), email: email.trim(), password, isAdmin: false })
    .then((res) => res.data);

// Mirrors ValidateUser.ValidateUserData so readers see the problem before the request goes out.
export function validateRegistration({ userName, email, password, confirmPassword }) {
  const name = userName.trim();
  const mail = email.trim();

  if (!name) return "Username is required.";
  if (name.length < 4) return "Username must be at least 4 characters long.";
  if (name.length > 15) return "Username cannot exceed 15 characters.";
  if (!mail) return "Email is required.";
  if (!mail.includes("@") || !mail.includes(".")) return "Email is not valid.";
  if (mail.length > 100) return "Email cannot exceed 100 characters.";
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters long.";
  if (password.length > 35) return "Password cannot exceed 35 characters.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return null;
}

// UserService throws ArgumentException (e.g. "Username already exists."), which reaches us as a
// plain-text 500 starting with "System.ArgumentException: <message>". Pull the message out of it.
export function registerErrorMessage(err) {
  const data = err?.response?.data;
  if (!err?.response) return "Could not create your account. Is the API running?";

  if (typeof data === "string") {
    const match = data.match(/ArgumentException:\s*([^\r\n]+)/);
    if (match) return match[1].trim();
  }
  if (data?.errors) return Object.values(data.errors).flat().join(" ");
  return "Could not create your account. Please try again.";
}
