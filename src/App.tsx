import { useEffect, useCallback } from "react";
import { useTodoStore } from "./store/todoStore";
import TodoItem from "./components/TodoItem";
import TodoInput from "./components/TodoInput";
import BottomToolbar from "./components/BottomToolbar";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { LogicalSize } from "@tauri-apps/api/dpi";

const appWindow = getCurrentWebviewWindow();

function App() {
  const {
    todos,
    collapsed,
    darkMode,
    loaded,
    groups,
    addTodo,
    toggleTodo,
    deleteTodo,
    toggleCollapsed,
    deleteGroup,
    loadFromDisk,
  } = useTodoStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    try {
      const invoke = (window as any).__TAURI_INTERNALS__?.invoke;
      if (invoke) {
        invoke("load_todos").then((data: any) => {
          if (data) loadFromDisk(data);
        });
      } else {
        loadFromDisk({ todos: [], darkMode: true, groups: ["默认"] });
      }
    } catch {
      loadFromDisk({ todos: [], darkMode: true, groups: ["默认"] });
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    appWindow.setSize(new LogicalSize(300, collapsed ? 34 : 420)).catch(() => {});
  }, [loaded]);

  const startDrag = useCallback(async (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".no-drag")) return;
    try {
      await appWindow.startDragging();
    } catch {}
  }, []);

  if (!loaded) return null;

  const doneCount = todos.filter((t) => t.done).length;

  if (collapsed) {
    const pct = todos.length ? doneCount / todos.length : 0;
    return (
      <div
        className="h-screen bg-white dark:bg-[#1a1a2e] text-gray-900 dark:text-gray-100
          rounded-lg overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10
          flex items-center select-none"
      >
        {/* Drag handle */}
        <div
          className="h-full flex items-center px-2 cursor-grab active:cursor-grabbing
            text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors text-sm leading-none"
          onMouseDown={startDrag}
        >
          ⠿
        </div>

        {/* Info + progress decoration */}
        <div className="flex-1 flex items-center gap-2 min-w-0 h-full px-1">
          <span className="text-xs font-semibold whitespace-nowrap">📋 FloatTodo</span>

          {/* Progress bar decoration */}
          <div className="flex-1 max-w-[72px] h-[3px] rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-cyan-400 transition-all"
              style={{ width: `${pct * 100}%` }}
            />
          </div>

          <span className="text-[10px] text-gray-400 dark:text-gray-500 tabular-nums tracking-tight">
            {doneCount}/{todos.length}
          </span>
        </div>

        {/* Expand button */}
        <button
          onClick={toggleCollapsed}
          className="h-full px-2.5 flex items-center no-drag
            text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300
            hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-xs"
        >
          ▸
        </button>
      </div>
    );
  }

  return (
    <div
      className="h-screen flex flex-col bg-white dark:bg-[#1a1a2e] text-gray-900 dark:text-gray-100
        rounded-lg overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10 select-none"
    >
      <div
        className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-white/5"
        onMouseDown={startDrag}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">📋 FloatTodo</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggleCollapsed(); }}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors no-drag text-xs px-1"
          title="折叠"
        >
          ▾
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {todos.length === 0 ? (
          <div className="text-center text-gray-400 dark:text-gray-500 text-xs py-8">
            暂无待办
          </div>
        ) : (
          groups.map((group) => {
            const groupTodos = todos.filter((t) => t.group === group);
            if (groupTodos.length === 0) return null;
            return (
              <div key={group}>
                <div className="flex items-center gap-1 px-3 py-1 text-[10px] text-gray-400 dark:text-gray-500
                  bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                  <span>{group}</span>
                  <span className="ml-auto">{groupTodos.filter((t) => !t.done).length}/{groupTodos.length}</span>
                  <button
                    onClick={() => deleteGroup(group)}
                    className="text-gray-300 dark:text-gray-600 hover:text-red-400 no-drag ml-1"
                  >
                    ✕
                  </button>
                </div>
                {groupTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={() => toggleTodo(todo.id)}
                    onDelete={() => deleteTodo(todo.id)}
                  />
                ))}
              </div>
            );
          })
        )}
      </div>

      <TodoInput onAdd={addTodo} />
      <BottomToolbar />
    </div>
  );
}

export default App;
