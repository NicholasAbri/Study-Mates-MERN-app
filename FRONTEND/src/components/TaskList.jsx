import TaskRow from "./TaskRow";

export default function TaskList({
  tasks,
  currentFilter,
  searchTerm,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}) {
  const today = new Date().toISOString().split("T")[0];

  if (tasks.length === 0) {
    return (
      <div className="empty-task-state">
        <div className="empty-task-icon">
          <i className="fa-solid fa-clipboard-list"></i>
        </div>

        <h3>No tasks yet</h3>
        <p>Add your first study task above to get started.</p>
      </div>
    );
  }

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.name.toLowerCase().includes(normalizedSearch);

    if (!matchesSearch) return false;

    if (currentFilter === "pending") {
      return !task.done;
    }

    if (currentFilter === "completed") {
      return task.done;
    }

    if (currentFilter === "overdue") {
      return !task.done && task.date && task.date.slice(0, 10) < today;
    }

    if (currentFilter === "high") {
      return task.priority === "high";
    }

    return true;
  });

  if (filteredTasks.length === 0) {
    return (
      <div className="task-list">
        <div className="task-row">
          <p>No matching tasks found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list">
      {filteredTasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
        />
      ))}
    </div>
  );
}
