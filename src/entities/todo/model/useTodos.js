import { useState } from "react";

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [nextId, setNextId] = useState(1);

  const addTodo = (text, date) => {
    setTodos((prev) => [...prev, { id: nextId, text, completed: false, date }]);
    setNextId((id) => id + 1);
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const editTodo = (id, text) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
  };

  return { todos, addTodo, deleteTodo, toggleTodo, editTodo };
}
