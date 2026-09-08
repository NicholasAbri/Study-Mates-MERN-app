import { useEffect, useState } from "react";
import PromptModal from "./PromptModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function TrashPage({ active, user, showToast, onTaskRestored }) {
  const [deletedTasks, setDeletedTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [actionId, setActionId] = useState(null);

  const [prompt, setPrompt] = useState({
    isOpen: false,
    task: null,
  });

  useEffect(() => {
    if (!active || !user) {
      return;
    }

    let cancelled = false;

    const fetchTrash = async () => {
      try {
        const response = await fetch(`${API_URL}/tasks/trash/all`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch trash");
        }

        const data = await response.json();

        if (!cancelled) {
          setDeletedTasks(data);
          setLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Trash error:", error);

          setLoading(false);

          showToast({
            type: "error",
            message: "Couldn't load your Trash.",
          });
        }
      }
    };

    fetchTrash();

    return () => {
      cancelled = true;
    };
  }, [active, user, showToast]);

  const handleRestore = async (taskId) => {
    setActionId(taskId);

    try {
      const response = await fetch(`${API_URL}/tasks/trash/${taskId}/restore`, {
        method: "PATCH",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to restore task");
      }

      setDeletedTasks((current) =>
        current.filter((task) => task._id !== taskId),
      );

      // Refresh the active task list
      // in App.jsx immediately.
      if (onTaskRestored) {
        await onTaskRestored();
      }

      showToast({
        type: "success",
        message: "Task restored successfully.",
      });
    } catch (error) {
      console.error("Restore error:", error);

      showToast({
        type: "error",
        message: error.message || "Couldn't restore task.",
      });
    } finally {
      setActionId(null);
    }
  };

  const requestPermanentDelete = (task) => {
    if (actionId) return;

    setPrompt({
      isOpen: true,
      task,
    });
  };

  const closePermanentDeletePrompt = () => {
    setPrompt({
      isOpen: false,
      task: null,
    });
  };

  const permanentlyDeleteTask = async () => {
    const task = prompt.task;

    if (!task) return;

    setActionId(task._id);

    closePermanentDeletePrompt();

    try {
      const response = await fetch(
        `${API_URL}/tasks/trash/${task._id}/permanent`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to permanently delete task");
      }

      setDeletedTasks((current) =>
        current.filter((currentTask) => currentTask._id !== task._id),
      );

      showToast({
        type: "success",
        message: "Task permanently deleted.",
      });
    } catch (error) {
      console.error("Permanent delete error:", error);

      showToast({
        type: "error",
        message: error.message || "Couldn't permanently delete task.",
      });
    } finally {
      setActionId(null);
    }
  };

  const formatDeletedDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (!active) return null;

  return (
    <>
      <section className="page trash-page active-page">
        <div className="page-heading">
          <h2>Trash</h2>

          <p>
            Deleted tasks stay here until you restore or permanently remove
            them.
          </p>
        </div>

        <div className="trash-card">
          {loading ? (
            <div className="trash-empty">
              <i className="fa-solid fa-spinner fa-spin"></i>

              <p>Loading your Trash...</p>
            </div>
          ) : deletedTasks.length === 0 ? (
            <div className="trash-empty">
              <div className="trash-empty-icon">
                <i className="fa-solid fa-trash-can"></i>
              </div>

              <h3>Your Trash is empty</h3>

              <p>Deleted tasks will appear here.</p>
            </div>
          ) : (
            <div className="trash-list">
              {deletedTasks.map((task) => {
                const busy = actionId === task._id;

                return (
                  <div className="trash-item" key={task._id}>
                    <div className="trash-item-main">
                      <div className="trash-task-icon">
                        <i className="fa-solid fa-trash-can"></i>
                      </div>

                      <div className="trash-task-content">
                        <h3>{task.title}</h3>

                        {task.description && <p>{task.description}</p>}

                        <span>Deleted {formatDeletedDate(task.deletedAt)}</span>
                      </div>
                    </div>

                    <div className="trash-actions">
                      <button
                        type="button"
                        className="trash-restore-btn"
                        onClick={() => handleRestore(task._id)}
                        disabled={busy}
                      >
                        {busy ? (
                          <span className="trash-spinner"></span>
                        ) : (
                          <i className="fa-solid fa-trash-arrow-up"></i>
                        )}

                        <span>{busy ? "Working..." : "Restore"}</span>
                      </button>

                      <button
                        type="button"
                        className="trash-delete-btn"
                        onClick={() => requestPermanentDelete(task)}
                        disabled={busy}
                      >
                        <i className="fa-solid fa-trash"></i>

                        <span>Delete permanently</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <PromptModal
        isOpen={prompt.isOpen}
        type="confirm"
        title="Delete permanently?"
        message={
          prompt.task
            ? `"${prompt.task.title}" will be permanently deleted. This cannot be undone.`
            : ""
        }
        confirmText="Delete permanently"
        cancelText="Keep task"
        onClose={closePermanentDeletePrompt}
        onConfirm={permanentlyDeleteTask}
      />
    </>
  );
}
