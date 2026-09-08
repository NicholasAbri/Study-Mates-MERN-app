import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function HistoryPage({ active, user, showToast }) {
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!active || !user) {
      return;
    }

    let cancelled = false;

    const fetchHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/history`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch history");
        }

        const data = await response.json();

        if (!cancelled) {
          setHistory(data);
          setLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("History error:", error);

          setLoading(false);

          showToast({
            type: "error",
            message: "Couldn't load your history.",
          });
        }
      }
    };

    fetchHistory();

    return () => {
      cancelled = true;
    };
  }, [active, user, showToast]);

  const getActionDetails = (action) => {
    switch (action) {
      case "created":
        return {
          label: "Created task",
          icon: "fa-plus",
          className: "history-created",
        };

      case "completed":
        return {
          label: "Completed task",
          icon: "fa-check",
          className: "history-completed",
        };

      case "uncompleted":
        return {
          label: "Marked task as pending",
          icon: "fa-rotate-left",
          className: "history-uncompleted",
        };

      case "edited":
        return {
          label: "Edited task",
          icon: "fa-pen",
          className: "history-edited",
        };

      case "deleted":
        return {
          label: "Moved task to Trash",
          icon: "fa-trash",
          className: "history-deleted",
        };

      case "restored":
        return {
          label: "Restored task",
          icon: "fa-trash-arrow-up",
          className: "history-restored",
        };

      default:
        return {
          label: "Updated task",
          icon: "fa-clock-rotate-left",
          className: "history-default",
        };
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (!active) {
    return null;
  }

  return (
    <section className="page history-page active-page">
      <div className="page-heading">
        <h2>History</h2>

        <p>Keep track of what you've been doing in StudyMate.</p>
      </div>

      <div className="history-card">
        {loading ? (
          <div className="history-empty">
            <i className="fa-solid fa-spinner fa-spin"></i>

            <p>Loading your history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="history-empty">
            <div className="history-empty-icon">
              <i className="fa-solid fa-clock-rotate-left"></i>
            </div>

            <h3>No activity yet</h3>

            <p>Your task activity will appear here as you use StudyMate.</p>
          </div>
        ) : (
          <div className="history-list">
            {history.map((item) => {
              const details = getActionDetails(item.action);

              return (
                <div className="history-item" key={item._id}>
                  <div className={`history-icon ${details.className}`}>
                    <i className={`fa-solid ${details.icon}`}></i>
                  </div>

                  <div className="history-content">
                    <div className="history-main">
                      <strong>{details.label}</strong>

                      <span>{item.taskTitle}</span>
                    </div>

                    <time>{formatDate(item.createdAt)}</time>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
