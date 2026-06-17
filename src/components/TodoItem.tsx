import { useState, useRef, useEffect } from "react";
import { useTodoStore } from "../store/todoStore";
import type { Todo, Priority } from "../types/todo";

const priorityDots: Record<Priority, string> = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-gray-300 dark:bg-gray-500",
};

interface Props {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  const { expandedId, setExpandedId, groups, moveTodo, editTodo } = useTodoStore();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  const isExpanded = expandedId === todo.id;

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const saveEdit = () => {
    const t = editText.trim();
    if (t && t !== todo.text) editTodo(todo.id, t);
    setEditing(false);
  };

  return (
    <div
      className={`flex items-start gap-2 px-3 py-1.5 transition-colors group
        ${todo.done ? "opacity-40" : "hover:bg-gray-50 dark:hover:bg-white/5"}`}
    >
      <button
        onClick={onToggle}
        className={`mt-0.5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center
          transition-all no-drag
          ${todo.done
            ? "bg-green-500 border-green-500 text-white"
            : "border-gray-300 dark:border-gray-500 hover:border-gray-400 dark:hover:border-gray-400"
          }`}
      >
        {todo.done && (
          <svg viewBox="0 0 12 12" className="w-3 h-3 fill-current">
            <path d="M3.5 6.2L5 7.7 8.5 4.2l-.7-.7L5 6.3 4.2 5.5z" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={inputRef}
            value={editText}
            onChange={(e) => setEditText(e.currentTarget.value)}
            onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditing(false); }}
            onBlur={saveEdit}
            className="w-full text-sm bg-transparent text-gray-900 dark:text-gray-100
              border-b border-cyan-400 outline-none no-drag"
          />
        ) : (
          <div className="flex items-center gap-1 cursor-pointer no-drag" onClick={() => setExpandedId(isExpanded ? null : todo.id)}>
            <span
              className={`text-sm block break-words flex-1
                ${isExpanded ? "" : "line-clamp-1"}
                ${todo.done
                  ? "line-through text-gray-300 dark:text-gray-600"
                  : "text-gray-900 dark:text-gray-100"}`}
            >
              {todo.text}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setEditText(todo.text); setEditing(true); }}
              className="text-gray-400 dark:text-gray-500 hover:text-cyan-500 dark:hover:text-cyan-400
                transition-colors no-drag text-[11px] px-0.5 flex-shrink-0"
              title="编辑"
            >
              ✎
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 flex-shrink-0 pt-0.5">
        <div className={`w-2 h-2 rounded-full ${priorityDots[todo.priority]}`} />

        {groups.length > 1 && (
          <select
            value={todo.group}
            onChange={(e) => moveTodo(todo.id, e.currentTarget.value)}
            className="text-[9px] bg-transparent text-gray-400 dark:text-gray-500
              border border-gray-200 dark:border-white/10 rounded px-0.5 py-0
              outline-none no-drag cursor-pointer max-w-[48px] truncate"
            onClick={(e) => e.stopPropagation()}
          >
            {groups.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        )}

        <button
          onClick={onDelete}
          className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400
            transition-colors no-drag text-xs px-1"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
