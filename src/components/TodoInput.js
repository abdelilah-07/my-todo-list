import { useState } from "react";

const TodoInput = ({ categories, onAdd }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [dueDate, setDueDate] = useState("");
  const [reminderMinutes, setReminderMinutes] = useState(30);

  const submit = (e) => {
    e.preventDefault();

    onAdd({
      name,
      category,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      reminderMinutesBefore: reminderMinutes,
    });

    setName("");
    setDueDate("");
    setReminderMinutes(30);
  };

  return (
    <form className="todo-container" onSubmit={submit}>
      <input
        className="todo-input"
        value={name}
        placeholder="Add a new task..."
        onChange={(e) => setName(e.target.value)}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((cat) => (
          <option key={cat}>{cat}</option>
        ))}
      </select>

      <input
        type="datetime-local"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <input
        type="number"
        min="0"
        value={reminderMinutes}
        onChange={(e) => setReminderMinutes(e.target.value)}
        title="Minutes before reminding"
      />

      <button className="save-button">Save</button>
    </form>
  );
};

export default TodoInput;
