import { useState } from "react";

const API_URL = "http://localhost:4000";

export default function AuthModal({
  isOpen,
  initialMode = "login",
  onClose,
  onSuccess,
}) {
  const [mode, setMode] = useState(initialMode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setFormError("");
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");
    setLoading(true);

    try {
      const endpoint =
        mode === "login" ? `${API_URL}/sign-in` : `${API_URL}/sign-up`;

      const body =
        mode === "login"
          ? {
              email: email.trim(),
              password,
            }
          : {
              name: name.trim(),
              email: email.trim(),
              password,
            };

      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormError(
          data.message || "Authentication failed. Please try again.",
        );

        return;
      }

      onSuccess(data.data);

      resetForm();
      onClose();
    } catch (error) {
      console.error("Authentication error:", error);

      setFormError("Unable to connect to StudyMate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="auth-modal-header">
          <div className="auth-logo-icon">
            <i className="fa-solid fa-user-graduate"></i>
          </div>

          <h2>{mode === "login" ? "Welcome Back!" : "Create Account"}</h2>

          <p>
            {mode === "login"
              ? "Log in to continue tracking your study progress"
              : "Join StudyMate today to reach your goals"}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => switchMode("login")}
          >
            Login
          </button>

          <button
            type="button"
            className={`auth-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => switchMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "signup" && (
            <div className="auth-input-group">
              <label>Full Name</label>

              <div className="input-with-icon">
                <i className="fa-solid fa-user"></i>

                <input
                  type="text"
                  placeholder="e.g. Alex Smith"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setFormError("");
                  }}
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-input-group">
            <label>Email Address</label>

            <div className="input-with-icon">
              <i className="fa-solid fa-envelope"></i>

              <input
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setFormError("");
                }}
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label>Password</label>

            <div className="input-with-icon">
              <i className="fa-solid fa-lock"></i>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setFormError("");
                }}
                required
              />
            </div>
          </div>

          {formError && (
            <div className="auth-form-error" role="alert">
              <i className="fa-solid fa-circle-exclamation"></i>

              <span>{formError}</span>
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Log In"
                : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
