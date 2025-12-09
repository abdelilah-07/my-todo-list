import { useEffect, useState } from "react";
import TodoInput from "./TodoInput";
import TodoList from "./TodoList";

const CATEGORIES = ["Work", "Personal", "Study", "Health", "Other"];

const Todo = () => {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem("taskify-tasks");
    return stored ? JSON.parse(stored) : [];
  });

  const [filterStatus, setFilterStatus] = useState("all"); // all | active | done
  const [filterCategory, setFilterCategory] = useState("all"); // all or category

  // persist tasks
  useEffect(() => {
    localStorage.setItem("taskify-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // reminder system (checks every minute)
  useEffect(() => {
    const timer = setInterval(() => {
      setTasks((prev) =>
        prev.map((task) => {
          if (!task.dueDate || !task.reminderMinutesBefore || task.reminded) {
            return task;
          }

          const due = new Date(task.dueDate);
          const reminderTime = new Date(due);
          reminderTime.setMinutes(
            reminderTime.getMinutes() - task.reminderMinutesBefore
          );

          const now = new Date();

          if (now >= reminderTime && !task.reminded && !task.completed) {
            alert(`Reminder: "${task.name}" is due at ${due.toLocaleString()}`);
            return { ...task, reminded: true };
          }

          return task;
        })
      );
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // -------------------
  // CRUD OPERATIONS
  // -------------------

  const addTask = ({ name, category, dueDate, reminderMinutesBefore }) => {
    if (!name.trim()) return;

    const newTask = {
      id: crypto.randomUUID(),
      name: name.trim(),
      completed: false,
      category,
      dueDate: dueDate || null,
      reminderMinutesBefore: reminderMinutesBefore || null,
      reminded: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [...prev, newTask]);
  };

  const toggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // ✅ UPDATE TASK (Edit)
  const updateTask = (id, updates) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  // drag & drop reorder
  const updateOrder = (sourceId, targetId) => {
    setTasks((prev) => {
      const current = [...prev];
      const fromIndex = current.findIndex((t) => t.id === sourceId);
      const toIndex = current.findIndex((t) => t.id === targetId);

      if (fromIndex === -1 || toIndex === -1) return current;

      const [moved] = current.splice(fromIndex, 1);
      current.splice(toIndex, 0, moved);

      return current;
    });
  };

  // -------------------
  // PROGRESS
  // -------------------

  const completedCount = tasks.filter((t) => t.completed).length;

  const progress = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  // -------------------
  // FILTERS
  // -------------------

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "active" && task.completed) return false;
    if (filterStatus === "done" && !task.completed) return false;
    if (filterCategory !== "all" && task.category !== filterCategory)
      return false;

    return true;
  });

  // -------------------
  // UI
  // -------------------

  return (
    <main className="taskify">
      <header className="taskify-header">
        <h1 className="todo-title">Taskify</h1>
        <p className="todo-subtitle">
          Organize tasks by category, deadline, and progress.
        </p>
      </header>

      <TodoInput categories={CATEGORIES} onAdd={addTask} />

      {/* Progress */}
      <section className="progress-container">
        <div className="progress-header">
          <span>{progress}% completed</span>
          <span>
            {completedCount}/{tasks.length} tasks
          </span>
        </div>

        <div className="progress-bar">
          <div style={{ width: `${progress}%` }} />
        </div>
      </section>

      {/* Filters */}
      <section className="filters">
        <div className="filter-group">
          <button
            className={`filter-chip ${
              filterStatus === "all" ? "active" : ""
            }`}
            onClick={() => setFilterStatus("all")}
          >
            All
          </button>

          <button
            className={`filter-chip ${
              filterStatus === "active" ? "active" : ""
            }`}
            onClick={() => setFilterStatus("active")}
          >
            Active
          </button>

          <button
            className={`filter-chip ${
              filterStatus === "done" ? "active" : ""
            }`}
            onClick={() => setFilterStatus("done")}
          >
            Done
          </button>
        </div>

        <select
          className="filter-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">All categories</option>

          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </section>

      <TodoList
        tasks={filteredTasks}
        onToggleComplete={toggleComplete}
        onDelete={deleteTask}
        onUpdate={updateTask}   /* ✅ Added */
        onReorder={updateOrder}
      />
    </main>
  );
};

export default Todo;
