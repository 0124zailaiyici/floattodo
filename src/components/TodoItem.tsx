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
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 transition-colors
        ${todo.done ? "opacity-40" : "hover:bg-gray-50 dark:hover:bg-white/5"}`}
    >
      <button
        onClick={onToggle}
        className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center
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

      <span
        className={`flex-1 text-sm truncate transition-colors
          ${todo.done
            ? "line-through text-gray-300 dark:text-gray-600"
            : "text-gray-900 dark:text-gray-100"}`}
      >
        {todo.text}
      </span>

      <div className={`w-2 h-2 rounded-full ${priorityDots[todo.priority]}`} />

      <button
        onClick={onDelete}
        className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-all no-drag text-xs px-1"
      >
        ✕
      </button>
    </div>
  );
}
