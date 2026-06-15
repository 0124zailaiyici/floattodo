import { useEffect, useCallback } from "react";
import { useTodoStore } from "./store/todoStore";
import TodoItem from "./components/TodoItem";
import TodoInput from "./components/TodoInput";
import BottomToolbar from "./components/BottomToolbar";
let dragState: {
  startX: number;
  startY: number;
  winX: number;
  winY: number;
} | null = null;

function handleMouseMove(e: MouseEvent) {
  if (!dragState) return;
  const dx = e.screenX - dragState.startX;
  const dy = e.screenY - dragState.startY;
  try {
    const invoke = (window as any).__TAURI_INTERNALS__?.invoke;
    if (invoke) {
      invoke("set_window_position", {
        x: dragState.winX + dx,
        y: dragState.winY + dy,
      });
    }
  } catch {}
}

function handleMouseUp() {
  dragState = null;
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
}

function App() {
  const {
    todos,
    expanded,
    darkMode,
    focusMode,
    loaded,
    addTodo,
    toggleTodo,
    deleteTodo,
    toggleExpanded,
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
        loadFromDisk({ todos: [], darkMode: true });
      }
    } catch {
      loadFromDisk({ todos: [], darkMode: true });
    }
  }, []);

  const onDragStart = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".no-drag")) return;
    dragState = {
      startX: e.screenX,
      startY: e.screenY,
      winX: e.screenX,
      winY: e.screenY,
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

  if (!loaded) return null;

  const visibleTodos = expanded ? todos : todos.slice(0, 3);

  return (
    <div
      className={`h-screen flex flex-col transition-all duration-200
        ${focusMode ? "opacity-40" : "opacity-100"}
        ${darkMode
          ? "bg-[#1a1a2e] text-gray-200"
          : "bg-white text-gray-800 shadow-lg"
        }
        rounded-lg overflow-hidden shadow-2xl border ${darkMode ? "border-white/10" : "border-gray-200"}`}
      onMouseDown={onDragStart}
    >
      <div className="flex items-center justify-between px-3 py-2 drag-region">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">📋 FloatTodo</span>
          {!expanded && todos.length > 3 && (
            <span className="text-[10px] text-gray-500">+{todos.length - 3}</span>
          )}
        </div>
        <div className="flex items-center gap-1 no-drag">
          {!expanded && (
            <button
              onClick={toggleExpanded}
              className="text-gray-600 hover:text-gray-400 text-xs px-1"
              title="展开"
            >
              ▸
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none">
        {visibleTodos.length === 0 ? (
          <div className="text-center text-gray-600 text-xs py-6">暂无待办</div>
        ) : (
          visibleTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={() => toggleTodo(todo.id)}
              onDelete={() => deleteTodo(todo.id)}
            />
          ))
        )}
      </div>

      <TodoInput onAdd={addTodo} />
      <BottomToolbar />
    </div>
  );
}

export default App;
