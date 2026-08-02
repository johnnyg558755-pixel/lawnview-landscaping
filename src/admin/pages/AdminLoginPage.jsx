import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../auth/AuthContext";
import "../AdminLoginPage.css";

function AdminLoginPage() {
  const { session, loading } = useAuth();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const destination =
    location.state?.from?.pathname || "/admin";

  if (!loading && session && !submitting) {
    return <Navigate to={destination} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (error) {
      setErrorMessage(
        "The email or password is incorrect.",
      );
      setSubmitting(false);
      return;
    }

    const { error: refreshError } =
      await supabase.auth.refreshSession();

    if (refreshError) {
      await supabase.auth.signOut();

      setErrorMessage(
        "Your session could not be started. Please try again.",
      );
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <span className="admin-login-mark">L</span>

          <div>
            <p className="admin-login-eyebrow">
              Lawnview Landscaping
            </p>
            <h1>Admin login</h1>
          </div>
        </div>

        <p className="admin-login-intro">
          Sign in to manage customers, inquiries, jobs,
          estimates, and invoices.
        </p>

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="admin-email">
            Email address
          </label>

          <input
            id="admin-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />

          <label htmlFor="admin-password">
            Password
          </label>

          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />

          {errorMessage && (
            <p
              className="admin-login-error"
              role="alert"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Signing in…"
              : "Sign in"}
          </button>
        </form>

        <a
          className="admin-login-home"
          href="/"
        >
          Return to Lawnview website
        </a>
      </section>
    </main>
  );
}

export default AdminLoginPage;