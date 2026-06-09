import { useState, useEffect } from "react";
import { loadJson, saveJson } from "@/shared/lib";

const STORAGE_KEY = "todos";

function getInitialNextId(todos) {
  return todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
}

export function useTodos() {
  const [todos, setTodos] = useState(() => loadJson(STORAGE_KEY, []));
  const [nextId, setNextId] = useState(() => getInitialNextId(loadJson(STORAGE_KEY, [])));

  useEffect(() => {
    saveJson(STORAGE_KEY, todos);
  }, [todos]);

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
