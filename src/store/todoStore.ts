import { create } from "zustand";
import { type Todo, type Priority, type TodoData } from "../types/todo";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { LogicalSize } from "@tauri-apps/api/dpi";

const appWindow = getCurrentWebviewWindow();

interface TodoStore {
  todos: Todo[];
  collapsed: boolean;
  darkMode: boolean;
  loaded: boolean;

  addTodo: (text: string, priority: Priority) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  clearDone: () => void;
  setCollapsed: (v: boolean) => void;
  toggleCollapsed: () => void;
  setDarkMode: (v: boolean) => void;
  loadFromDisk: (data: TodoData) => void;
  saveToDisk: () => void;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  collapsed: true,
  darkMode: true,
  loaded: false,

  addTodo: (text, priority) => {
    const todo: Todo = {
      id: generateId(),
      text,
      done: false,
      priority,
      createdAt: Date.now(),
    };
    set((s) => ({ todos: [todo, ...s.todos] }));
    get().saveToDisk();
  },

  toggleTodo: (id) => {
    set((s) => ({
      todos: s.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));
    get().saveToDisk();
  },

  deleteTodo: (id) => {
    set((s) => ({ todos: s.todos.filter((t) => t.id !== id) }));
    get().saveToDisk();
  },

  clearDone: () => {
    set((s) => ({ todos: s.todos.filter((t) => !t.done) }));
    get().saveToDisk();
  },

  setCollapsed: (v) => {
    set({ collapsed: v });
    appWindow.setSize(new LogicalSize(300, v ? 34 : 420)).catch(() => {});
  },
  toggleCollapsed: () => {
    const next = !get().collapsed;
    get().setCollapsed(next);
  },
  setDarkMode: (v) => {
    set({ darkMode: v });
    get().saveToDisk();
  },

  loadFromDisk: (data) => {
    set({ todos: data.todos, darkMode: data.darkMode, loaded: true });
  },

  saveToDisk: () => {
    const { todos, darkMode } = get();
    try {
      const invoke = (window as any).__TAURI_INTERNALS__?.invoke;
      if (invoke) {
        invoke("save_todos", { todos, darkMode });
      }
    } catch {}
  },
}));
