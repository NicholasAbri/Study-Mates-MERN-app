export default function TaskFilter({
  currentFilter,
  searchTerm,
  onSearchChange,
  onFilterChange,
}) {
  const filters = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "overdue", label: "Overdue" },
    { value: "high", label: "High Priority" },
  ];

  return (
    <div className="tasks-card-heading">
      <div className="tasks-heading-top">
        <h2>Your Tasks</h2>

        <div className="task-search-box">
          <i className="fa-solid fa-magnifying-glass"></i>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
          />
        </div>
      </div>

      <div className="task-filter-buttons">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            className={`filter-btn ${
              currentFilter === filter.value ? "active" : ""
            }`}
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
