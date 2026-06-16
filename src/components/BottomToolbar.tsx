import { useTodoStore } from "../store/todoStore";

export default function BottomToolbar() {
  const { toggleCollapsed, darkMode, setDarkMode, clearDone, todos } =
    useTodoStore();

  const doneCount = todos.filter((t) => t.done).length;
  const totalCount = todos.length;

  return (
    <div className="flex items-center justify-between px-3 py-1.5 border-t border-gray-100 dark:border-white/10 text-[11px] text-gray-400 dark:text-gray-500">
      <span>
        {doneCount}/{totalCount}
      </span>

      <div className="flex items-center gap-3">
        {totalCount > 0 && (
          <button
            onClick={clearDone}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors no-drag"
          >
            清理
          </button>
        )}

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors no-drag"
          title="切换主题"
        >
          {darkMode ? "☀" : "☾"}
        </button>

        <button
          onClick={toggleCollapsed}
          className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors no-drag"
          title="折叠"
        >
          ▾
        </button>
      </div>
    </div>
  );
}
