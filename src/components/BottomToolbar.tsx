import { useTodoStore } from "../store/todoStore";

export default function BottomToolbar() {
  const { expanded, toggleExpanded, darkMode, setDarkMode, focusMode, setFocusMode, clearDone, todos } =
    useTodoStore();

  const doneCount = todos.filter((t) => t.done).length;
  const totalCount = todos.length;

  return (
    <div className="flex items-center justify-between px-3 py-1.5 border-t border-white/10 text-[11px] text-gray-600">
      <span>
        {doneCount}/{totalCount}
      </span>

      <div className="flex items-center gap-2">
        {totalCount > 0 && (
          <button onClick={clearDone} className="hover:text-gray-400 transition-colors no-drag">
            清理
          </button>
        )}

        <button
          onClick={() => setFocusMode(!focusMode)}
          className={`transition-colors no-drag ${focusMode ? "text-accent" : "hover:text-gray-400"}`}
          title="专注模式"
        >
          专注
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="hover:text-gray-400 transition-colors no-drag"
          title="切换主题"
        >
          {darkMode ? "☀" : "☾"}
        </button>

        <button
          onClick={toggleExpanded}
          className="hover:text-gray-400 transition-colors no-drag"
          title={expanded ? "折叠" : "展开"}
        >
          {expanded ? "▼" : "▲"}
        </button>
      </div>
    </div>
  );
}
