export default function Sidebar({
  currentPage,
  onPageChange,
  darkMode,
  onToggleTheme,
  onOpenAuth,
  user,
  onLogout,
  logoutLoading,
  isOpen,
  onClose,
}) {
  const menuItems = [
    {
      page: "home",
      icon: "fa-house",
      label: "Dashboard",
    },
    {
      page: "studyTasks",
      icon: "fa-clipboard-list",
      label: "Study Tasks",
    },
    {
      page: "progress",
      icon: "fa-chart-line",
      label: "Progress",
    },
    {
      page: "history",
      icon: "fa-clock-rotate-left",
      label: "History",
    },
    {
      page: "trash",
      icon: "fa-trash-can",
      label: "Trash",
    },
    {
      page: "profile",
      icon: "fa-user",
      label: "Profile",
    },
    {
      page: "settings",
      icon: "fa-gear",
      label: "Settings",
    },
  ];

  const handlePageChange = (page) => {
    if (logoutLoading) return;

    onPageChange(page);
    onClose();
  };

  const firstName = user?.name?.trim().split(" ")[0] || "Student";

  const avatarLetter = firstName.charAt(0).toUpperCase();

  return (
    <>
      {isOpen && (
        <div
          className="mobile-sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="logo">
          <i className="fa-solid fa-user-graduate"></i>

          <div>
            <h2>StudyMate</h2>
            <p>Plan • Focus • Achieve</p>
          </div>

          <button
            type="button"
            className="mobile-sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <ul className="menu">
          {menuItems.map((item) => (
            <li
              key={item.page}
              className={item.page === currentPage ? "active" : ""}
              onClick={() => handlePageChange(item.page)}
            >
              <i className={`fa-solid ${item.icon}`}></i>

              <span>{item.label}</span>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          {user ? (
            <div
              className={`user-profile-badge ${
                logoutLoading ? "logout-in-progress" : ""
              }`}
            >
              <div className="user-info">
                <div className="user-avatar">{avatarLetter}</div>

                <span className="user-name">{firstName}</span>
              </div>

              <button
                type="button"
                className="btn-logout"
                onClick={onLogout}
                disabled={logoutLoading}
                title={logoutLoading ? "Signing out..." : "Log out"}
                aria-label={logoutLoading ? "Signing out" : "Log out"}
              >
                {logoutLoading ? (
                  <span className="logout-spinner" aria-hidden="true"></span>
                ) : (
                  <i className="fa-solid fa-right-from-bracket"></i>
                )}
              </button>
            </div>
          ) : (
            <div className="sidebar-auth-row">
              <button
                type="button"
                className="sidebar-btn btn-login"
                onClick={() => onOpenAuth("login")}
              >
                <i className="fa-solid fa-right-to-bracket"></i>
                <span>Login</span>
              </button>

              <button
                type="button"
                className="sidebar-btn btn-signup"
                onClick={() => onOpenAuth("signup")}
              >
                <i className="fa-solid fa-user-plus"></i>
                <span>Signup</span>
              </button>
            </div>
          )}

          <button
            type="button"
            className={`theme-toggle-sm-bar ${darkMode ? "active" : ""}`}
            onClick={onToggleTheme}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle dark mode"
          >
            <div className="theme-toggle-icon-wrap">
              <i className={`fa-solid ${darkMode ? "fa-moon" : "fa-sun"}`}></i>

              <span>{darkMode ? "Dark Mode" : "Light Mode"}</span>
            </div>

            <div className="theme-switch-pill"></div>
          </button>
        </div>
      </aside>
    </>
  );
}
