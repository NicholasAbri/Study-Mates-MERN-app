import { useState } from "react";

export default function TaskForm({
  taskName,
  taskDate,
  taskPriority,
  onTaskNameChange,
  onTaskDateChange,
  onTaskPriorityChange,
  onAddTask,
}) {
  const [priorityOpen, setPriorityOpen] = useState(false);

  const priorityOptions = [
    {
      value: "low",
      label: "Low",
      icon: "fa-flag",
      className: "low",
    },
    {
      value: "medium",
      label: "Medium",
      icon: "fa-flag",
      className: "medium",
    },
    {
      value: "high",
      label: "High",
      icon: "fa-flag",
      className: "high",
    },
  ];

  const selectedPriority =
    priorityOptions.find((option) => option.value === taskPriority) ||
    priorityOptions[1];

  return (
    <div className="add-task-card">
      <div className="task-input-box">
        <i className="fa-solid fa-pen-to-square"></i>

        <input
          type="text"
          value={taskName}
          onChange={(e) => onTaskNameChange(e.target.value)}
          placeholder="Enter study task"
        />
      </div>

      <div className="date-input-box">
        <i className="fa-solid fa-calendar-days"></i>

        <input
          type="date"
          value={taskDate}
          onChange={(e) => onTaskDateChange(e.target.value)}
        />
      </div>

      <div className="priority-picker">
        <button
          type="button"
          className="priority-trigger"
          onClick={() => setPriorityOpen((prev) => !prev)}
        >
          <span className={`priority-dot ${selectedPriority.className}`}>
            <i className={`fa-solid ${selectedPriority.icon}`}></i>
          </span>

          <span>
            {taskPriority ? selectedPriority.label : "Select priority"}
          </span>

          <i
            className={`fa-solid fa-chevron-down priority-chevron ${
              priorityOpen ? "rotate" : ""
            }`}
          ></i>
        </button>

        {priorityOpen && (
          <div className="priority-menu">
            {priorityOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                className={`priority-option ${
                  taskPriority === option.value ? "selected" : ""
                }`}
                onClick={() => {
                  onTaskPriorityChange(option.value);
                  setPriorityOpen(false);
                }}
              >
                <span className={`priority-dot ${option.className}`}>
                  <i className={`fa-solid ${option.icon}`}></i>
                </span>

                <span>{option.label}</span>

                {taskPriority === option.value && (
                  <i className="fa-solid fa-check priority-check"></i>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <button id="addTaskBtn" type="button" onClick={onAddTask}>
        Add Task
      </button>
    </div>
  );
}
