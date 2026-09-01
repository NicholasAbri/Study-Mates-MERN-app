import DashboardTasks from "./DashboardTasks";

export default function HomePage({
  active,
  pendingCount,
  completedCount,
  tasks,
  user,
  tasksLoading,
  onViewTasks,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}) {
  const today = new Date().toISOString().split("T")[0];

  const todayPendingTasks = tasks.filter(
    (task) => task.date?.startsWith(today) && !task.done,
  );

  const focusTask = todayPendingTasks[0];

  const firstName = user?.name?.trim().split(" ")[0];

  return (
    <section
      id="home"
      className={active ? "page home-screen active-page" : "page home-screen"}
    >
      <div className="welcome-text">
        <h1>
          Welcome
          {firstName ? `, ${firstName}` : ""}! 👋
        </h1>

        <p>Let's make today productive.</p>
      </div>

      <div className="top-cards">
        <div className="focus-card dash-card">
          <i className="fa-solid fa-book-open fa-2xl"></i>

          <div className="card-content">
            <h3>Today's Focus</h3>

            <h2>
              {tasksLoading
                ? "—"
                : focusTask
                  ? focusTask.name
                  : "You're all caught up!"}
            </h2>

            <p>
              {tasksLoading
                ? "Loading your tasks..."
                : focusTask
                  ? `${focusTask.priority} priority`
                  : "Enjoy your day!"}
            </p>
          </div>
        </div>

        <div className="pending-card dash-card">
          <i className="fa-solid fa-hourglass-half fa-2xl"></i>

          <div className="card-content">
            <h3>Pending Tasks</h3>
            <h2>{tasksLoading ? "—" : pendingCount}</h2>
            <p>Tasks to do.</p>
          </div>
        </div>

        <div className="completed-card dash-card">
          <i className="fa-solid fa-circle-check fa-2xl"></i>

          <div className="card-content">
            <h3>Completed Tasks</h3>
            <h2>{tasksLoading ? "—" : completedCount}</h2>
            <p>Great job!</p>
          </div>
        </div>
      </div>

      <div className="bottom-cards">
        <div className="today-tasks-card">
          <h3>
            <i className="fa-solid fa-list fa-xl"></i>
            Today's Tasks
          </h3>

          <DashboardTasks
            tasks={tasks}
            tasksLoading={tasksLoading}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
          />

          <button
            className="view-tasks-btn"
            type="button"
            onClick={onViewTasks}
          >
            View all tasks
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <div className="daily-motivation-card">
          <div className="motivation-header">
            <div className="motivation-icon">
              <i className="fa-solid fa-lightbulb fa-3x"></i>
            </div>

            <h3>Daily Motivation</h3>
          </div>

          <p className="motivation-quote">
            “The secret of getting ahead is getting started.”
          </p>

          <p className="motivation-author">— Mark Twain</p>

          <div className="motivation-note">
            <p>
              <i className="fa-solid fa-star"></i>
              Believe in yourself and keep moving forward.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
