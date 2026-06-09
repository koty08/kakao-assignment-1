import { useState } from "react";
import { Button } from "@/shared/ui";

export function EditTodoForm({ todo, onSave, onDelete }) {
  const [text, setText] = useState(todo.text);
  const [error, setError] = useState(false);

  const handleSave = () => {
    if (!text.trim()) {
      setError(true);
      return;
    }
    onSave(todo.id, text.trim());
  };

  return (
    <li className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-primary">
      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />

      <input
        autoFocus
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError(false);
        }}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
        maxLength={100}
        className={`flex-1 text-sm px-2 py-1 rounded-lg border outline-none transition-colors
          ${error ? "border-red-400" : "border-gray-200 focus:border-primary"}`}
      />

      <div className="flex gap-1 flex-shrink-0">
        <Button variant="save" onClick={handleSave}>
          저장
        </Button>
        <Button variant="danger" onClick={() => onDelete(todo.id)}>
          삭제
        </Button>
      </div>
    </li>
  );
}
