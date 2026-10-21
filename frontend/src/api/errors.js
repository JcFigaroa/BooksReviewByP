// Turns an axios error into a short, human message for toasts.
export function errorMessage(err, fallback) {
  const res = err?.response;
  if (!res) return `${fallback}. Is the API running?`;

  const data = res.data;
  if (typeof data === "string" && data.trim()) return data;
  if (data?.errors) return Object.values(data.errors).flat().join(" ");
  if (data?.title) return data.title;

  if (res.status === 401 || res.status === 403) return "Your session has expired. Please log in again.";
  if (res.status === 404) return `${fallback}: not found on the server (404).`;
  return `${fallback} (${res.status}).`;
}
