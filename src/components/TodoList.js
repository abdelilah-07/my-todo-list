import { useState } from "react";

const TodoList = ({
  tasks,
  onDelete,
  onToggleComplete,
  onUpdate,
  onReorder,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [edit, setEdit] = useState({});

  const startEdit = (task) => {
    setEditingId(task.id);
    setEdit({
      name: task.name,
      category: task.category,
      dueDate: task.dueDate ? task.dueDate.slice(0, 16) : "",
      reminderMinutesBefore: task.reminderMinutesBefore || "",
    });
  };

  const saveEdit = (id) => {
    onUpdate(id, {
      ...edit,
      dueDate: edit.dueDate
        ? new Date(edit.dueDate).toISOString()
        : null,
      reminded: false,
    });

    setEditingId(null);
  };

  const handleDrag = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (e, targetId) => {
    const sourceId = e.dataTransfer.getData("text/plain");
    onReorder(sourceId, targetId);
  };

  // helpers for due status
  const getDueState = (task) => {
    if (!task.dueDate || task.completed) return "";

    const due = new Date(task.dueDate);
    const now = new Date();
    const diff = due - now;
    const hours = diff / (1000 * 60 * 60);

    if (hours < 0) return "overdue";
    if (hours <= 24) return "due-soon";

    return "";
  };

  return (
    <ul className="todo-list">
      {tasks.map((task) => {
        const editing = editingId === task.id;
        const dueState = getDueState(task);

        return (
          <li
            key={task.id}
            draggable={!editing}
            onDragStart={(e) => handleDrag(e, task.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, task.id)}
            className={`todo-item ${task.completed ? "done" : ""} ${dueState}`}
          >
            {editing ? (
              // ---------------- Edit Mode ----------------
              <div className="edit-form">
                <input
                  value={edit.name}
                  onChange={(e) =>
                    setEdit({ ...edit, name: e.target.value })
                  }
                />

                <select
                  value={edit.category}
                  onChange={(e) =>
                    setEdit({ ...edit, category: e.target.value })
                  }
                >
                  <option>Work</option>
                  <option>Study</option>
                  <option>Personal</option>
                  <option>Health</option>
                  <option>Other</option>
                </select>

                <input
                  type="datetime-local"
                  value={edit.dueDate}
                  onChange={(e) =>
                    setEdit({ ...edit, dueDate: e.target.value })
                  }
                />

                <input
                  type="number"
                  min="0"
                  placeholder="Reminder"
                  value={edit.reminderMinutesBefore}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      reminderMinutesBefore: e.target.value,
                    })
                  }
                />

                <button
                  className="save-btn"
                  onClick={() => saveEdit(task.id)}
                >
                  Save
                </button>

                <button
                  className="cancel-btn"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              // ---------------- Display Mode ----------------
              <>
                <div className="task-content">
                  <label>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => onToggleComplete(task.id)}
                    />
                    <span>{task.name}</span>
                  </label>

                  {task.category && (
                    <span className="task-badge">
                      {task.category}
                    </span>
                  )}

                  {/* ✅ DUE TIME DISPLAY */}
                  {task.dueDate && (
                    <span className="task-due">
                      Due:{" "}
                      {new Date(task.dueDate).toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="task-actions">
                  <button
                    className="edit-btn"
                    onClick={() => startEdit(task)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => onDelete(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default TodoList;
