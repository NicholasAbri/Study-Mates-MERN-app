export default function DashboardTasks({
  tasks,
  tasksLoading,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}) {
  if (tasksLoading) {
    return (
      <div className="task-item">
        <p>Loading today's tasks...</p>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  const todayTasks = tasks.filter((task) => task.date?.startsWith(today));

  if (todayTasks.length === 0) {
    return (
      <div className="task-item">
        <p>No tasks for today.</p>
      </div>
    );
  }

  return (
    <>
      {todayTasks.slice(0, 4).map((task) => (
        <div
          key={task.id}
          className={`task-item ${task.done ? "completed" : ""}`}
        >
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => onToggleTask(task.id)}
          />

          <div className="dashboard-task-content">
            <p>{task.name}</p>

            <span className={`priority-badge ${task.priority}`}>
              {task.priority}
            </span>
          </div>

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
      ))}
    </>
  );
}
