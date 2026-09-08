import { useCallback, useEffect, useLayoutEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import HomePage from "./components/HomePage";
import StudyTasksPage from "./components/StudyTasksPage";
import ProgressPage from "./components/ProgressPage";
import ProfilePage from "./components/ProfilePage";
import HistoryPage from "./components/HistoryPage";
import TrashPage from "./components/TrashPage";
import SettingsPage from "./components/SettingsPage";
import AuthModal from "./components/AuthModal";
import EditTaskModal from "./components/EditTaskModal";
import PromptModal from "./components/PromptModal";

import "./style.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("");

  const [currentFilter, setCurrentFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [prompt, setPrompt] = useState({
    isOpen: false,
    type: "confirm",
    title: "",
    message: "",
    confirmText: "Okay",
    cancelText: "Cancel",
  });

  const [toast, setToast] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const [user, setUser] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const showToast = useCallback(({ type = "success", message }) => {
    setToast({
      isOpen: true,
      type,
      message,
    });

    window.setTimeout(() => {
      setToast((current) => ({
        ...current,
        isOpen: false,
      }));
    }, 3200);
  }, []);

  const showPrompt = ({
    type = "confirm",
    title,
    message,
    confirmText = "Okay",
    cancelText = "Cancel",
  }) => {
    setPrompt({
      isOpen: true,
      type,
      title,
      message,
      confirmText,
      cancelText,
    });
  };

  const closePrompt = () => {
    setPrompt((current) => ({
      ...current,
      isOpen: false,
    }));

    setDeleteTarget(null);
  };

  // =========================
  // LOAD CURRENT USER
  // =========================

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await fetch(`${API_URL}/profile`, {
          credentials: "include",
        });

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();

        setUser(data.data);
      } catch (error) {
        console.error("Error loading current user:", error);

        setUser(null);
      }
    };

    loadCurrentUser();
  }, []);

  // =========================
  // LOAD TASKS
  // =========================

  const loadTasks = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        credentials: "include",
      });

      if (response.status === 401) {
        setTasks([]);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();

      const formattedTasks = data.map((task) => ({
        id: task._id,
        name: task.title,
        description: task.description || "",
        date: task.dueDate || "",
        done: task.completed,
        priority: task.priority || "medium",
      }));

      setTasks(formattedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);

      showToast({
        type: "error",
        message: "Couldn't load your tasks.",
      });
    }
  }, [showToast]);

  useEffect(() => {
    const fetchInitialTasks = async () => {
      setTasksLoading(true);

      try {
        await loadTasks();
      } finally {
        setTasksLoading(false);
      }
    };

    fetchInitialTasks();
  }, [user, loadTasks]);

  // =========================
  // TASK COUNTS
  // =========================

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((task) => task.done).length;

  const pendingTasks = totalTasks - completedTasks;

  const completionRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  // =========================
  // DARK MODE
  // =========================

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark-mode", darkMode);

    document.body.classList.toggle("dark-mode", darkMode);

    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // =========================
  // ADD TASK
  // =========================

  const handleAddTask = async () => {
    const trimmedName = taskName.trim();

    if (!trimmedName) {
      showToast({
        type: "error",
        message: "Please enter a task before adding it.",
      });

      return;
    }

    if (!taskDate) {
      showToast({
        type: "error",
        message: "Please choose a due date.",
      });

      return;
    }

    if (!taskPriority) {
      showToast({
        type: "error",
        message: "Please select a priority.",
      });

      return;
    }

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedName,
          dueDate: taskDate,
          priority: taskPriority,
        }),
      });

      if (response.status === 401) {
        setUser(null);

        showToast({
          type: "error",
          message: "Please log in to add tasks.",
        });

        return;
      }

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const newTask = await response.json();

      const formattedTask = {
        id: newTask._id,
        name: newTask.title,
        description: newTask.description || "",
        date: newTask.dueDate || "",
        done: newTask.completed,
        priority: newTask.priority || "medium",
      };

      setTasks((current) => [...current, formattedTask]);

      setTaskName("");
      setTaskDate("");
      setTaskPriority("");

      showToast({
        type: "success",
        message: `"${newTask.title}" was added.`,
      });
    } catch (error) {
      console.error("Error creating task:", error);

      showToast({
        type: "error",
        message: "Something went wrong while saving your task.",
      });
    }
  };

  // =========================
  // TOGGLE TASK
  // =========================

  const handleToggleTask = async (id) => {
    const task = tasks.find((currentTask) => currentTask.id === id);

    if (!task) return;

    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !task.done,
        }),
      });

      if (response.status === 401) {
        setUser(null);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();

      const formattedTask = {
        id: updatedTask._id,
        name: updatedTask.title,
        description: updatedTask.description || "",
        date: updatedTask.dueDate || "",
        done: updatedTask.completed,
        priority: updatedTask.priority || "medium",
      };

      setTasks((current) =>
        current.map((currentTask) =>
          currentTask.id === id ? formattedTask : currentTask,
        ),
      );

      showToast({
        type: "success",
        message: updatedTask.completed
          ? "Task completed."
          : "Task marked as pending.",
      });
    } catch (error) {
      console.error("Error updating task:", error);

      showToast({
        type: "error",
        message: "The task could not be updated.",
      });
    }
  };

  // =========================
  // DELETE TASK
  // =========================

  const handleDeleteTask = (task) => {
    setDeleteTarget(task);

    showPrompt({
      type: "confirm",
      title: "Move this task to Trash?",
      message: `"${task.name}" will be moved to Trash.`,
      confirmText: "Move to Trash",
      cancelText: "Keep task",
    });
  };

  const confirmDeleteTask = async () => {
    if (!deleteTarget) return;

    const task = deleteTarget;

    try {
      const response = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.status === 401) {
        closePrompt();
        setUser(null);

        showToast({
          type: "error",
          message: "Your session has expired. Please log in again.",
        });

        return;
      }

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((current) =>
        current.filter((currentTask) => currentTask.id !== task.id),
      );

      closePrompt();

      showToast({
        type: "success",
        message: `"${task.name}" was moved to Trash.`,
      });
    } catch (error) {
      console.error("Error deleting task:", error);

      closePrompt();

      showToast({
        type: "error",
        message: "The task could not be moved to Trash.",
      });
    }
  };

  // =========================
  // EDIT TASK
  // =========================

  const handleEditTask = (task) => {
    setEditingTask(task);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedTask) => {
    if (!updatedTask.title.trim()) {
      showToast({
        type: "error",
        message: "Your task needs a name.",
      });

      return;
    }

    if (!updatedTask.dueDate) {
      showToast({
        type: "error",
        message: "Please choose a due date.",
      });

      return;
    }

    try {
      const response = await fetch(`${API_URL}/tasks/${updatedTask.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: updatedTask.title.trim(),
          dueDate: updatedTask.dueDate,
          priority: updatedTask.priority,
        }),
      });

      if (response.status === 401) {
        setUser(null);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const data = await response.json();

      const formattedTask = {
        id: data._id,
        name: data.title,
        description: data.description || "",
        date: data.dueDate || "",
        done: data.completed,
        priority: data.priority || "medium",
      };

      setTasks((current) =>
        current.map((task) =>
          task.id === updatedTask.id ? formattedTask : task,
        ),
      );

      setEditModalOpen(false);
      setEditingTask(null);

      showToast({
        type: "success",
        message: `"${data.title}" was updated.`,
      });
    } catch (error) {
      console.error("Error editing task:", error);

      showToast({
        type: "error",
        message: "Something went wrong while saving your changes.",
      });
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditingTask(null);
  };

  // =========================
  // NAVIGATION
  // =========================

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewTasks = () => {
    setCurrentPage("studyTasks");
  };

  const handleNextStepClick = () => {
    setCurrentPage("studyTasks");
  };

  // =========================
  // AUTH
  // =========================

  const handleOpenAuth = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);

    showToast({
      type: "success",
      message:
        authMode === "login"
          ? `Welcome back, ${userData.name.split(" ")[0]}!`
          : "Your StudyMate account has been created.",
    });
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    if (logoutLoading) return;

    setLogoutLoading(true);

    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setTasks([]);
      setCurrentPage("home");
      setLogoutLoading(false);

      showToast({
        type: "success",
        message: "You have been logged out.",
      });
    }
  };

  // =========================
  // RESTORE TASK
  // =========================

  const handleTaskRestored = async () => {
    await loadTasks();
  };

  return (
    <div className={`app-shell ${darkMode ? "dark-mode" : ""}`}>
      {!sidebarOpen && (
        <button
          type="button"
          className="sidebar-hamburger"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      )}

      <Sidebar
        currentPage={currentPage}
        onPageChange={handlePageChange}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((prev) => !prev)}
        onOpenAuth={handleOpenAuth}
        user={user}
        onLogout={handleLogout}
        logoutLoading={logoutLoading}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main">
        <HomePage
          active={currentPage === "home"}
          pendingCount={pendingTasks}
          completedCount={completedTasks}
          tasks={tasks}
          user={user}
          tasksLoading={tasksLoading}
          onViewTasks={handleViewTasks}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
        />

        <StudyTasksPage
          active={currentPage === "studyTasks"}
          taskName={taskName}
          taskDate={taskDate}
          taskPriority={taskPriority}
          currentFilter={currentFilter}
          searchTerm={searchTerm}
          tasks={tasks}
          onTaskNameChange={setTaskName}
          onTaskDateChange={setTaskDate}
          onTaskPriorityChange={setTaskPriority}
          onSearchChange={setSearchTerm}
          onAddTask={handleAddTask}
          onFilterChange={setCurrentFilter}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
        />

        <ProgressPage
          active={currentPage === "progress"}
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          pendingTasks={pendingTasks}
          completionRate={completionRate}
          onNextStepClick={handleNextStepClick}
        />

        <ProfilePage
          key={user?._id || "profile"}
          active={currentPage === "profile"}
          user={user}
          onProfileUpdated={setUser}
          showToast={showToast}
        />

        <HistoryPage
          active={currentPage === "history"}
          user={user}
          showToast={showToast}
        />

        <TrashPage
          active={currentPage === "trash"}
          user={user}
          showToast={showToast}
          onTaskRestored={handleTaskRestored}
        />

        <SettingsPage
          active={currentPage === "settings"}
          user={user}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode((prev) => !prev)}
          onGoToProfile={() => setCurrentPage("profile")}
          onLogout={handleLogout}
          logoutLoading={logoutLoading}
        />
      </main>

      {toast.isOpen && (
        <div
          className={`toast toast-${toast.type}`}
          role="status"
          aria-live="polite"
        >
          <i
            className={
              toast.type === "success"
                ? "fa-solid fa-circle-check"
                : "fa-solid fa-circle-exclamation"
            }
          ></i>

          <span>{toast.message}</span>
        </div>
      )}

      <AuthModal
        key={`${authMode}-${authModalOpen}`}
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <EditTaskModal
        key={
          editingTask
            ? `${editingTask.id}-${editingTask.name}-${editingTask.date}-${editingTask.priority}`
            : "edit-task"
        }
        isOpen={editModalOpen}
        task={editingTask}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
      />

      <PromptModal
        isOpen={prompt.isOpen}
        type={prompt.type}
        title={prompt.title}
        message={prompt.message}
        confirmText={prompt.confirmText}
        cancelText={prompt.cancelText}
        onClose={closePrompt}
        onConfirm={confirmDeleteTask}
      />
    </div>
  );
}

export default App;
