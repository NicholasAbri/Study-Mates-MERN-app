import { useState } from "react";

export default function EditTaskModal({ isOpen, task, onClose, onSave }) {
  const [taskName, setTaskName] = useState(task?.name || "");

  const [taskDate, setTaskDate] = useState(
    task?.date ? task.date.slice(0, 10) : "",
  );

  const [taskPriority, setTaskPriority] = useState(task?.priority || "medium");

  if (!isOpen || !task) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    onSave({
      id: task.id,
      title: taskName,
      dueDate: taskDate,
      priority: taskPriority,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="edit-task-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close edit task"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="edit-modal-header">
          <div className="edit-modal-icon">
            <i className="fa-solid fa-pen-to-square"></i>
          </div>

          <h2>Edit Task</h2>

          <p>Update your study task.</p>
        </div>

        <form onSubmit={handleSubmit} className="edit-task-form">
          <div className="edit-input-group">
            <label htmlFor="edit-task-name">Task</label>

            <input
              id="edit-task-name"
              type="text"
              value={taskName}
              onChange={(event) => setTaskName(event.target.value)}
              required
            />
          </div>

          <div className="edit-input-group">
            <label htmlFor="edit-task-date">Due Date</label>

            <input
              id="edit-task-date"
              type="date"
              value={taskDate}
              onChange={(event) => setTaskDate(event.target.value)}
              required
            />
          </div>

          <div className="edit-input-group">
            <label htmlFor="edit-task-priority">Priority</label>

            <select
              id="edit-task-priority"
              value={taskPriority}
              onChange={(event) => setTaskPriority(event.target.value)}
            >
              <option value="low">Low</option>

              <option value="medium">Medium</option>

              <option value="high">High</option>
            </select>
          </div>

          <div className="edit-modal-actions">
            <button type="button" className="cancel-edit-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-task-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
