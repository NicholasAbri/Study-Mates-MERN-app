import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ProfilePage({
  active,
  user,
  onProfileUpdated,
  showToast,
}) {
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(user?.name || "");

  const [loading, setLoading] = useState(false);

  const firstName = user?.name?.trim().split(" ")[0] || "Student";

  const avatarLetter = firstName.charAt(0).toUpperCase();

  const handleEdit = () => {
    setName(user?.name || "");
    setEditing(true);
  };

  const handleCancel = () => {
    setName(user?.name || "");
    setEditing(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      showToast({
        type: "error",
        message: "Your name cannot be empty.",
      });

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      onProfileUpdated(data.data);

      setEditing(false);

      showToast({
        type: "success",
        message: "Your profile has been updated.",
      });
    } catch (error) {
      console.error("Profile update error:", error);

      showToast({
        type: "error",
        message: error.message || "Could not update your profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!active) {
    return null;
  }

  return (
    <section className="page profile-page active-page">
      <div className="page-heading">
        <h2>My Profile</h2>

        <p>Manage your StudyMate account information.</p>
      </div>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{avatarLetter}</div>

          <div className="profile-identity">
            <h2>{user?.name || "Student"}</h2>

            <p>{user?.email || ""}</p>
          </div>
        </div>

        <div className="profile-divider"></div>

        <div className="profile-section">
          <div className="profile-section-heading">
            <div>
              <h3>Personal Information</h3>

              <p>Your basic account details.</p>
            </div>

            {!editing && (
              <button
                type="button"
                className="profile-edit-btn"
                onClick={handleEdit}
              >
                <i className="fa-solid fa-pen"></i>
                Edit
              </button>
            )}
          </div>

          {!editing ? (
            <div className="profile-details">
              <div className="profile-detail">
                <span>Name</span>

                <strong>{user?.name || "Student"}</strong>
              </div>

              <div className="profile-detail">
                <span>Email</span>

                <strong>{user?.email || "—"}</strong>
              </div>
            </div>
          ) : (
            <form className="profile-edit-form" onSubmit={handleSave}>
              <div className="profile-input-group">
                <label htmlFor="profile-name">Name</label>

                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="profile-detail">
                <span>Email</span>

                <strong>{user?.email || "—"}</strong>
              </div>

              <div className="profile-actions">
                <button
                  type="button"
                  className="profile-cancel-btn"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="profile-save-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="profile-spinner"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-check"></i>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="profile-divider"></div>

        <div className="profile-account-info">
          <h3>Account</h3>

          <div className="profile-detail">
            <span>Member since</span>

            <strong>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                : "—"}
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}
