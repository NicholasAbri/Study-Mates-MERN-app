export default function OverviewCards({
  totalTasks,
  completedTasks,
  pendingTasks,
  completionRate,
}) {
  return (
    <div className="overview-card">
      <h2>Overview</h2>
      <div className="overview-boxes">
        <div className="overview-box">
          <div className="overview-icon total-icon">
            <i className="fa-solid fa-list-check"></i>
          </div>
          <h3>Total Tasks</h3>
          <h4>{totalTasks}</h4>
        </div>
        <div className="overview-box">
          <div className="overview-icon completed-icon">
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <h3>Completed</h3>
          <h4>{completedTasks}</h4>
        </div>
        <div className="overview-box">
          <div className="overview-icon pending-icon">
            <i className="fa-solid fa-hourglass-half"></i>
          </div>
          <h3>Pending</h3>
          <h4>{pendingTasks}</h4>
        </div>
        <div className="overview-box">
          <div className="overview-icon rate-icon">
            <i className="fa-solid fa-circle-notch"></i>
          </div>
          <h3>Completion Rate</h3>
          <h4>{completionRate}%</h4>
        </div>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${completionRate}%` }}
        ></div>
      </div>
    </div>
  );
}
