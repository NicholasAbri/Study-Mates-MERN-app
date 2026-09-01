function formatTaskDate(dateValue) {
  if (!dateValue) return "No due date";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isOverdue(task) {
  if (!task.date || task.done) return false;

  const today = new Date().toISOString().split("T")[0];

  return task.date.slice(0, 10) < today;
}

export default function TaskRow({
  task,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}) {
  const overdue = isOverdue(task);

  return (
    <div className={`task-row ${overdue ? "overdue-task" : ""}`}>
      <div className="task-left">
        <button
          type="button"
          className={`task-circle ${task.done ? "completed" : ""}`}
          onClick={() => onToggleTask(task.id)}
        >
          {task.done ? <i className="fa-solid fa-check"></i> : null}
        </button>

        <div className="task-details">
          <p className={`task-text ${task.done ? "done" : ""}`}>{task.name}</p>

          <div className="task-meta">
            <span className="task-date">
              <i className="fa-regular fa-calendar"></i>
              {formatTaskDate(task.date)}
            </span>

            <span className={`priority-badge ${task.priority}`}>
              {task.priority}
            </span>

            {overdue && <span className="overdue-badge">Overdue</span>}
          </div>
        </div>
      </div>

      <div className="task-actions">
        <i
          className="fa-solid fa-pen-to-square edit-task"
          role="button"
          aria-label={`Edit ${task.name}`}
          onClick={() => onEditTask(task)}
        ></i>

        <i
          className="fa-regular fa-trash-can delete-task"
          role="button"
          aria-label={`Delete ${task.name}`}
          onClick={() => onDeleteTask(task)}
        ></i>
      </div>
    </div>
  );
}
