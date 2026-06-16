import { useState } from "react";
import type { Priority } from "../types/todo";

interface Props {
  onAdd: (text: string, priority: Priority) => void;
}

const priorities: { key: Priority; label: string; color: string }[] = [
  { key: "high", label: "高", color: "bg-red-500" },
  { key: "medium", label: "中", color: "bg-yellow-500" },
  { key: "low", label: "低", color: "bg-gray-500" },
];

export default function TodoInput({ onAdd }: Props) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed, priority);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-t border-white/10">
      <input
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        placeholder="添加待办..."
        className="flex-1 bg-transparent text-sm text-gray-100 placeholder-gray-500
          outline-none no-drag"
      />
      <div className="flex gap-1 no-drag">
        {priorities.map((p) => (
          <button
            key={p.key}
            onClick={() => setPriority(p.key)}
            className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center
              transition-all
              ${priority === p.key
                ? `${p.color} text-white scale-110`
                : "bg-white/20 text-gray-300 hover:bg-white/30"
              }`}
            title={p.label}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
