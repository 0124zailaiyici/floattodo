import type { Todo, Priority } from "../types/todo";

const priorityDots: Record<Priority, string> = {
  high: "bg-red-400",
  medium: "bg-yellow-400",
  low: "bg-gray-400",
};

interface Props {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors
        ${todo.done ? "opacity-50" : "hover:bg-white/5"}`}
    >
      <button
        onClick={onToggle}
        className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center
          transition-all no-drag
          ${todo.done
            ? "bg-green-500 border-green-500 text-white"
            : "border-gray-400 hover:border-gray-200"
          }`}
      >
        {todo.done && (
          <svg viewBox="0 0 12 12" className="w-3 h-3 fill-current">
            <path d="M3.5 6.2L5 7.7 8.5 4.2l-.7-.7L5 6.3 4.2 5.5z" />
          </svg>
        )}
      </button>

      <span
        className={`flex-1 text-sm truncate transition-colors
          ${todo.done ? "line-through text-gray-500" : "text-gray-100"}`}
      >
        {todo.text}
      </span>

      <div className={`w-2 h-2 rounded-full ${priorityDots[todo.priority]}`} />

      <button
        onClick={onDelete}
        className="text-gray-400 hover:text-red-400 transition-all no-drag text-xs px-1"
      >
        ✕
      </button>
    </div>
  );
}
