import { useState } from "react";
import { Button, Input } from "@/shared/ui";

export function AddTodoForm({ onAdd }) {
  const [text, setText] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (!text.trim()) {
      setError(true);
      return;
    }
    onAdd(text.trim());
    setText("");
    setError(false);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="할 일을 입력하세요..."
          maxLength={100}
          error={error}
        />
        <Button variant="primary" onClick={handleSubmit} className="px-5 flex-shrink-0">
          추가
        </Button>
      </div>
      {error && <p className="text-xs text-red-500 px-1">할 일을 입력해주세요.</p>}
    </div>
  );
}
