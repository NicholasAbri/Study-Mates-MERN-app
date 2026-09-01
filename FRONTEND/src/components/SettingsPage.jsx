export default function SettingsPage({
  active,
  user,
  darkMode,
  onToggleTheme,
  onGoToProfile,
  onLogout,
  logoutLoading,
}) {
  if (!active) return null;

  return (
    <section className="page settings-page active-page">
      <div className="page-heading">
        <h2>Settings</h2>

        <p>Manage your StudyMate preferences and account.</p>
      </div>

      <div className="settings-card">
        <div className="settings-section">
          <h3>Appearance</h3>

          <button
            type="button"
            className="settings-row settings-button"
            onClick={onToggleTheme}
          >
            <div className="settings-row-content">
              <div className="settings-row-icon appearance-icon">
                <i
                  className={`fa-solid ${darkMode ? "fa-moon" : "fa-sun"}`}
                ></i>
              </div>

              <div>
                <strong>Dark Mode</strong>

                <span>
                  {darkMode
                    ? "Dark appearance is enabled"
                    : "Light appearance is enabled"}
                </span>
              </div>
            </div>

            <div className={`settings-switch ${darkMode ? "active" : ""}`}>
              <span></span>
            </div>
          </button>
        </div>

        <div className="settings-divider"></div>

        <div className="settings-section">
          <h3>Account</h3>

          <button
            type="button"
            className="settings-row settings-button"
            onClick={onGoToProfile}
          >
            <div className="settings-row-content">
              <div className="settings-row-icon account-icon">
                <i className="fa-solid fa-user"></i>
              </div>

              <div>
                <strong>Profile</strong>

                <span>Manage your account</span>
              </div>
            </div>

            <i className="fa-solid fa-chevron-right settings-arrow"></i>
          </button>
        </div>

        {user && (
          <>
            <div className="settings-divider"></div>

            <div className="settings-section">
              <h3>Session</h3>

              <button
                type="button"
                className="settings-row settings-button logout-settings-row"
                onClick={onLogout}
                disabled={logoutLoading}
              >
                <div className="settings-row-content">
                  <div className="settings-row-icon logout-settings-icon">
                    {logoutLoading ? (
                      <span className="settings-logout-spinner"></span>
                    ) : (
                      <i className="fa-solid fa-right-from-bracket"></i>
                    )}
                  </div>

                  <div>
                    <strong>
                      {logoutLoading ? "Signing out..." : "Log out"}
                    </strong>

                    <span>
                      {logoutLoading
                        ? "Please wait..."
                        : "Sign out of this account"}
                    </span>
                  </div>
                </div>

                {!logoutLoading && (
                  <i className="fa-solid fa-chevron-right settings-arrow"></i>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
