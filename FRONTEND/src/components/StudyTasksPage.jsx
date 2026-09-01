import TaskForm from "./TaskForm";
import TaskFilter from "./TaskFilter";
import TaskList from "./TaskList";

export default function StudyTasksPage({
  active,
  taskName,
  taskDate,
  taskPriority,
  currentFilter,
  searchTerm,
  tasks,
  onTaskNameChange,
  onTaskDateChange,
  onTaskPriorityChange,
  onSearchChange,
  onAddTask,
  onFilterChange,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}) {
  return (
    <section
      id="studyTasks"
      className={
        active ? "page study-tasks-page active-page" : "page study-tasks-page"
      }
    >
      <div className="page-heading">
        <h2>Study Tasks</h2>
        <p>Add and manage your study tasks easily.</p>
      </div>

      <TaskForm
        taskName={taskName}
        taskDate={taskDate}
        taskPriority={taskPriority}
        onTaskNameChange={onTaskNameChange}
        onTaskDateChange={onTaskDateChange}
        onTaskPriorityChange={onTaskPriorityChange}
        onAddTask={onAddTask}
      />

      <div className="your-tasks-card">
        <TaskFilter
          currentFilter={currentFilter}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          onFilterChange={onFilterChange}
        />

        <TaskList
          tasks={tasks}
          currentFilter={currentFilter}
          searchTerm={searchTerm}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
        />
      </div>
    </section>
  );
}
