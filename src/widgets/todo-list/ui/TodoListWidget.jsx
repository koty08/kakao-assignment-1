import { useState } from "react";
import { TodoCard } from "@/entities/todo";
import { EditTodoForm } from "@/features/edit-todo";

export function TodoListWidget({ todos, onToggle, onEdit, onDelete }) {
  const [editingId, setEditingId] = useState(null);

  const handleSave = (id, text) => {
    onEdit(id, text);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    onDelete(id);
    setEditingId(null);
  };

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-14 text-gray-400">
        <span className="text-4xl">📋</span>
        <p className="text-sm">등록된 할 일이 없습니다.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {todos.map((todo) =>
        editingId === todo.id ? (
          <EditTodoForm key={todo.id} todo={todo} onSave={handleSave} onDelete={handleDelete} />
        ) : (
          <TodoCard key={todo.id} todo={todo} onToggle={onToggle} onEdit={setEditingId} onDelete={onDelete} />
        ),
      )}
    </ul>
  );
}
